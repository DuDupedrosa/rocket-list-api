import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import AdmZip from "adm-zip";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const compressPdf = `compress_pdf`;

function allowedCompressionLevels(level: string) {
  const levels = ["extreme", "recommended", "low"];

  return levels.includes(level);
}

function filesAreAllowed(files: Express.Multer.File[]): boolean {
  const allowedTypes = ["application/pdf"];
  const fileNotAllowed = files.find(
    (file) => !allowedTypes.includes(file.mimetype)
  );

  if (fileNotAllowed) return false;
  return true;
}

export async function compressAsync(req: Request, res: Response) {
  const tempPaths: string[] = [];
  const files = req.files as Express.Multer.File[];

  try {
    const compressionLevel = req.body.compressionLevel as string;

    if (!files || files.length <= 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "select_file_to_continue" });
    }

    if (!filesAreAllowed(files)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "field_must_be_pdf_to_compress" });
    }

    if (files.length > 2) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "you_can_process_2_files" });
    }

    if (!compressionLevel || !allowedCompressionLevels(compressionLevel)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_compression_level" });
    }

    // environments variables
    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${compressPdf}` });
    }

    // iniciar a instance do ILovePdf
    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("compress");
    await task.start();

    let count = 1;
    for (const file of files) {
      count++;
      const tempFileName = `${count}-${file.originalname}`;
      const tempPath = path.join(tmpdir(), tempFileName);
      tempPaths.push(tempPath);
      const bytes = await readFile(file.path);
      await writeFile(tempPath, bytes);
      const pdfFile = new ILovePDFFile(tempPath);
      await task.addFile(pdfFile);
    }

    await task.process({ compression_level: compressionLevel });
    const data = await task.download();

    // unique PDF
    if (files.length === 1) {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="file-compressed.pdf"`,
      });
      res.send(data);
    } else {
      // zip with all converted PDF
      const zip = new AdmZip(Buffer.from(data));
      const newZip = new AdmZip();

      zip.getEntries().forEach((entry) => {
        if (!entry.isDirectory && entry.entryName.endsWith(".pdf")) {
          const fileName = path.basename(entry.entryName);
          newZip.addFile(fileName, entry.getData());
        }
      });

      const cleanedZipBuffer = newZip.toBuffer();

      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="file-compressed.zip"`,
      });
      res.send(cleanedZipBuffer);
    }
  } catch (error) {
    void error;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${compressPdf}` });
  } finally {
    for (const file of files) {
      try {
        await unlink(file.path);
      } catch (err) {
        void err;
      }
    }

    for (const tempPath of tempPaths) {
      try {
        await unlink(tempPath);
      } catch (unlinkError) {
        void unlinkError;
      }
    }
  }
}
