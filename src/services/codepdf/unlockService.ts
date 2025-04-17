import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { Request, Response } from "express";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";
import { checkIfPdfIsEncrypted } from "../../helpers/methods/checkIfPdfIsEncrypted";

export async function unlockAsync(req: Request, res: Response) {
  const unlockPdf = "unlock_pdf";
  let tempPathToRemove;
  const file = req.file;

  try {
    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_pdf_to_unlock" });
    }

    if (file.mimetype != "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_pdf_is_allowed_to_unlock" });
    }

    const bytes = await readFile(file.path);
    const isEncrypted = await checkIfPdfIsEncrypted(bytes);

    if (!isEncrypted) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "pdf_already_unlock" });
    }

    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${unlockPdf}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("unlock");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath);
    await task.addFile(pdfFile);
    await task.process();

    const data = await task.download();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="unlock.pdf"`,
    });
    res.send(data);
  } catch (err) {
    void err;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${unlockPdf}` });
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
