import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { Request, Response } from "express";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const rotateOptions = {
  rotate_0: 0,
  rotate_90: 90,
  rotate_180: 180,
  rotate_270: 270,
};

function getRotateValue(rotate: number): 0 | 90 | 180 | 270 | undefined {
  const literal = {
    [rotateOptions.rotate_0]: rotateOptions.rotate_0,
    [rotateOptions.rotate_90]: rotateOptions.rotate_90,
    [rotateOptions.rotate_180]: rotateOptions.rotate_180,
    [rotateOptions.rotate_270]: rotateOptions.rotate_270,
  } as Record<number, 0 | 90 | 180 | 270>;

  return literal[rotate];
}

const allowedRotateTypes = Object.values(rotateOptions);

export async function rotateAsync(req: Request, res: Response) {
  const rotatePdf = "rotate_pdf";
  let tempPathToRemove;
  const file = req.file;

  try {
    const rotate = req.body.rotate as string;

    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_files" });
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_pdf_is_allowed_to_rotate" });
    }

    if (!rotate || !allowedRotateTypes.includes(Number(rotate))) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_rotate_pdf_type" });
    }

    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;
    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${rotatePdf}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("rotate");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    const bytes = await readFile(file.path);
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath, {
      rotate: getRotateValue(Number(rotate)),
    });
    await task.addFile(pdfFile);
    await task.process();

    const data = await task.download();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rotated.pdf"`,
    });
    res.send(data);
  } catch (err) {
    void err;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${rotatePdf}` });
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
