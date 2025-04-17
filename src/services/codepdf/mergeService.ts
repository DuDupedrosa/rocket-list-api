import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

export async function mergeAsync(req: Request, res: Response) {
  const tempPaths: string[] = [];
  const mergePdf = "merge_pdf";
  const files = req.files as Express.Multer.File[];

  try {
    if (!files || files.length <= 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "required_files" });
    }

    if (files.length === 1) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "require_min_2_pdf_to_merge" });
    }

    if (files.length > 2) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "you_can_process_2_files" });
    }

    // environments variables
    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;
    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${mergePdf}` });
    }

    // iniciar a instance do ILovePdf
    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("merge");
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

    await task.process();
    const data = await task.download();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="merge.pdf"`,
    });
    res.send(data);
  } catch (error) {
    void error;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${mergePdf}` });
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
