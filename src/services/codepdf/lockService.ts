import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";
import { checkIfPdfIsEncrypted } from "../../helpers/methods/checkIfPdfIsEncrypted";

export async function lockAsync(req: Request, res: Response) {
  const lockPdf = "lock_pdf";
  let tempPathToRemove;
  const file = req.file;

  try {
    const password = req.body.password as string;

    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_pdf_to_lock" });
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_pdf_is_allowed_to_lock" });
    }

    const bytes = await readFile(file.path);

    if (await checkIfPdfIsEncrypted(bytes)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "pdf_already_encrypted" });
    }

    if (!password) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_password_to_lock_pdf" });
    }

    if (password.length <= 2) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "password_min_3_caracteres" });
    }

    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${lockPdf}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("protect");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath);
    await task.addFile(pdfFile);
    await task.process({
      password,
    });

    const data = await task.download();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="lock.pdf"`,
    });
    res.send(data);
  } catch (err) {
    void err;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${lockPdf}` });
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
