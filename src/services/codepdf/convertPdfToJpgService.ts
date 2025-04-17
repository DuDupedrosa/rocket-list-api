import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import AdmZip from "adm-zip";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const modeOptions = {
  page: "pages",
  extract: "extract",
};

const allowedModeOptions = Object.values(modeOptions);
const imageType = "image/jpeg";
const zipType = "application/zip";
const zipMagicNumber = "80 75 3 4";
const jpgMagicNumber = ["255 216 255 224", "255 216 255 225"];

export async function convertPdfToJpgAsync(req: Request, res: Response) {
  const pdfJpg = "pdf_to_jpg";
  let tempPathToRemove;
  const file = req.file;
  try {
    const mode = req.body.mode as string;

    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_file_to_convert" });
    }

    if (file.mimetype != "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_pdf_is_allowed_to_convert_jpg" });
    }

    if (!mode || !allowedModeOptions.includes(mode)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_mode_type_pdf_to_jpg" });
    }

    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;
    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${pdfJpg}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("pdfjpg");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    const bytes = await readFile(file.path);
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath);
    await task.addFile(pdfFile);
    await task.process({ pdfjpg_mode: mode });

    const data = await task.download();
    // Converter para Uint8Array caso seja um ArrayBuffer
    const uint8Array =
      data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    // Pegar os primeiros 4 bytes para verificar o tipo do arquivo
    const signature = uint8Array.slice(0, 4).join(" ");

    if (jpgMagicNumber.includes(signature)) {
      res.set({
        "Content-Type": imageType,
        "Content-Disposition": `attachment; filename="pdf-to-jpg.jpg"`,
      });
      res.send(data);
    }

    if (signature === zipMagicNumber) {
      const zip = new AdmZip(Buffer.from(data));
      const newZip = new AdmZip();

      zip.getEntries().forEach((entry) => {
        if (!entry.isDirectory && entry.entryName.endsWith(".jpg")) {
          const fileName = path.basename(entry.entryName);
          newZip.addFile(fileName, entry.getData());
        }
      });

      const cleanedZipBuffer = newZip.toBuffer();
      res.set({
        "Content-Type": zipType,
        "Content-Disposition": `attachment; filename="pdf-to-jpg.zip"`,
      });
      res.send(cleanedZipBuffer);
    }

    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: "service_unavailable" });
  } catch (err) {
    void err;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${pdfJpg}` });
  } finally {
    try {
      if (file?.path) {
        await unlink(file.path);
      }

      if (tempPathToRemove) {
        await unlink(tempPathToRemove);
      }
    } catch (unlinkError) {
      void unlinkError;
    }
  }
}
