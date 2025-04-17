import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import AdmZip from "adm-zip";
import { Request, Response } from "express";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const convertImagesToPdf = "convert_images_to_pdf";

const orientationOptions = {
  portrait: "portrait",
  landscape: "landscape",
};

const marginOptions = {
  default: "default",
  small: "small",
  large: "large",
};

function imagesAreAllowed(files: Express.Multer.File[]): boolean {
  const allowedTypes = ["image/jpeg", "image/png"];
  const imageNotAllowed = files.find(
    (file) => !allowedTypes.includes(file.mimetype)
  );

  if (imageNotAllowed) return false;
  return true;
}

function getMarginValue(margin: string) {
  if (margin === marginOptions.small) {
    return 20;
  }

  if (margin === marginOptions.large) {
    return 25;
  }

  return 0;
}

function getOrientationValue(orientation: string) {
  if (orientation === orientationOptions.landscape) {
    return orientationOptions.landscape;
  }

  return orientationOptions.portrait;
}

export async function convertImages(req: Request, res: Response) {
  const tempPaths: string[] = [];
  const images = req.files as Express.Multer.File[];

  try {
    const { mergeAfter, orientation, margin } = req.body;

    if (images.length === 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "select_image_to_continue" });
    }

    if (images.length > 4) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "you_can_process_4_files" });
    }

    if (!imagesAreAllowed(images)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_jpeg_or_png_image_allowed_to_convert" });
    }

    // environments variables
    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${convertImagesToPdf}` });
    }

    // iniciar a instance do ILovePdf
    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("imagepdf");
    await task.start();

    let count = 1;
    for (const image of images) {
      count++;
      const tempFileName = `${count}-${image.originalname}`;
      const tempPath = path.join(tmpdir(), tempFileName);
      tempPaths.push(tempPath);
      const bytes = await readFile(image.path);
      await writeFile(tempPath, bytes);
      const pdfFile = new ILovePDFFile(tempPath);
      await task.addFile(pdfFile);
    }

    await task.process({
      pagesize: "A4",
      orientation: getOrientationValue(orientation),
      merge_after: mergeAfter === "true",
      margin: getMarginValue(margin),
    });

    const data = await task.download();

    // unique PDF
    if (mergeAfter === "true") {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="image-converted.pdf"`,
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
        "Content-Disposition": `attachment; filename="file.zip"`,
      });
      res.send(cleanedZipBuffer);
    }
  } catch (error) {
    void error;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${convertImagesToPdf}` });
  } finally {
    for (const image of images) {
      try {
        await unlink(image.path);
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
