import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import ILovePDFFile from "@ilovepdf/ilovepdf-nodejs/ILovePDFFile";
import { Request, Response } from "express";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { statusCodeEnum } from "../../helpers/enums/StatusCodeEnum";

const verticalPositionValues = {
  bottom: "bottom",
  top: "top",
};
const allowedVerticalPositionOptions = Object.values(verticalPositionValues);

const horizontalPositionValues = {
  left: "left",
  center: "center",
  right: "right",
};
const allowedHorizontalPositionOptions = Object.values(
  horizontalPositionValues
);

const pageTextValues = {
  page_n: "Página {n}",
  page_n_of_p: "Página {n} de {p}",
  page: "{n}",
};
const allowedTextOptions = Object.values(pageTextValues);

const fontFamilyValues = {
  arial: "Arial",
  arialUnicodeMs: "Arial Unicode MS",
  verdana: "Verdana",
  courier: "Courier",
  timesNewRoman: "Times New Roman",
  comicSansMs: "Comic Sans MS",
  wenQuanYiZenHei: "WenQuanYi Zen Hei",
  lohitMarathi: "Lohit Marathi",
};
const allowedFontFamilyOptions = Object.values(fontFamilyValues);

export async function addPageNumberAsync(req: Request, res: Response) {
  const pageNumber = "page_number_pdf";
  let tempPathToRemove;
  const file = req.file;

  try {
    const {
      start_page,
      vertical_position,
      horizontal_position,
      text,
      font_size,
      font_color,
      font_family,
    } = req.body;

    if (!file) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "select_file_to_continue" });
    }

    if (file.mimetype !== "application/pdf") {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "only_pdf_accepted" });
    }

    if (!start_page || Number(start_page) <= 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_starting_number" });
    }

    if (
      !vertical_position ||
      !allowedVerticalPositionOptions.includes(vertical_position)
    ) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_vertical_position" });
    }

    if (
      !horizontal_position ||
      !allowedHorizontalPositionOptions.includes(horizontal_position)
    ) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_horizontal_position" });
    }

    if (!text || !allowedTextOptions.includes(text)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_text" });
    }

    if (!font_family || !allowedFontFamilyOptions.includes(font_family)) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_font_family" });
    }

    if (!font_size || Number(font_size) <= 0) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_font_size" });
    }

    if (!font_color) {
      return res
        .status(statusCodeEnum.BAD_REQUEST)
        .json({ message: "invalid_font_color" });
    }

    const iLovePdfPublicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const iLovePdfSecretKey = process.env.ILOVEPDF_SECRET_KEY;
    if (!iLovePdfPublicKey || !iLovePdfSecretKey) {
      return res
        .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
        .json({ message: `missing_ilovepdf_keys|${pageNumber}` });
    }

    const instance = new ILovePDFApi(iLovePdfPublicKey, iLovePdfSecretKey);
    const task = instance.newTask("pagenumber");
    await task.start();
    const tempFileName = file.originalname;
    const tempPath = path.join(tmpdir(), tempFileName);
    tempPathToRemove = tempPath;
    const bytes = await readFile(file.path);
    await writeFile(tempPath, bytes);
    const pdfFile = new ILovePDFFile(tempPath);
    await task.addFile(pdfFile);
    await task.process({
      vertical_position: vertical_position,
      horizontal_position: horizontal_position,
      text,
      font_family: font_family,
      font_size: Number(font_size),
      font_color: font_color,
      pages: `${start_page}-end`,
    });

    const data = await task.download();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="page-number.pdf"`,
    });
    res.send(data);
  } catch (err) {
    void err;
    return res
      .status(statusCodeEnum.INTERNAL_SERVER_ERRO)
      .json({ message: `internal_server_error|${pageNumber}` });
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
