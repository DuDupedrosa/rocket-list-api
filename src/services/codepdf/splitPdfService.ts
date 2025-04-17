import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import AdmZip from "adm-zip";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const splitPdf = "split_pdf";

const splitModeValues = {
  ranges: "ranges",
  remove_pages: "remove_pages",
};
const allowedSplitModeOptions = Object.values(splitModeValues);

export async function splitPdfAsync(req: Request, res: Response) {
  let tempPathToRemove;
  const file = req.file;

  try {
    // Pegar o arquivo do FormData
    const mergeAfter = req.body.merge_after as string;
    const splitMode = req.body.split_mode as string;
    const pagesRange = req.body.pages_range as string;

    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_file_to_split" });
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "file_must_be_pdf_to_split" });
    }

    if (!splitMode || !allowedSplitModeOptions.includes(splitMode)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_split_mode_type" });
    }

    if (!pagesRange || pagesRange.length <= 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_page_ranges_type" });
    }

    // environments variables
    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${splitPdf}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("split");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    const bytes = await readFile(file.path);
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath);
    await task.addFile(pdfFile);

    if (splitMode === splitModeValues.ranges) {
      await task.process({
        split_mode: splitMode,
        ranges: pagesRange,
        merge_after: mergeAfter === "true",
      });
    } else {
      await task.process({
        ranges: pagesRange,
        remove_pages: pagesRange,
      });
    }

    const data = await task.download();

    if (mergeAfter === "false" && splitMode === splitModeValues.ranges) {
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
        "Content-Disposition": `attachment; filename="split.zip"`,
      });
      res.send(cleanedZipBuffer);
    } else {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="split.pdf"`,
      });
      res.send(data);
    }
  } catch (error) {
    void error;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${splitPdf}` });
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
