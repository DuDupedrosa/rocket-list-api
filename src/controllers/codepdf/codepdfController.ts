import { Response, Request } from "express";
import { addPageNumberAsync } from "../../services/codepdf/addPageNumberService";
import { compressAsync } from "../../services/codepdf/compressService";
import { convertImages } from "../../services/codepdf/convertImagesService";
import { lockAsync } from "../../services/codepdf/lockService";
import { mergeAsync } from "../../services/codepdf/mergeService";
import { convertOfficeAsync } from "../../services/codepdf/officeToPdfService";
import { convertPdfToJpgAsync } from "../../services/codepdf/convertPdfToJpgService";
import { rotateAsync } from "../../services/codepdf/rotateService";
import { splitPdfAsync } from "../../services/codepdf/splitPdfService";
import { unlockAsync } from "../../services/codepdf/unlockService";
import { watermarkAsync } from "../../services/codepdf/watermarkService";

export async function addPageNumberController(req: Request, res: Response) {
  await addPageNumberAsync(req, res);
}

export async function compressController(req: Request, res: Response) {
  await compressAsync(req, res);
}

export async function convertImagesController(req: Request, res: Response) {
  await convertImages(req, res);
}

export async function lockController(req: Request, res: Response) {
  await lockAsync(req, res);
}

export async function mergeController(req: Request, res: Response) {
  await mergeAsync(req, res);
}

export async function officeToPdfController(req: Request, res: Response) {
  await convertOfficeAsync(req, res);
}

export async function convertPdfToJpgController(req: Request, res: Response) {
  await convertPdfToJpgAsync(req, res);
}

export async function rotateController(req: Request, res: Response) {
  await rotateAsync(req, res);
}

export async function splitPdfController(req: Request, res: Response) {
  await splitPdfAsync(req, res);
}

export async function unlockController(req: Request, res: Response) {
  await unlockAsync(req, res);
}

export async function watermarkController(req: Request, res: Response) {
  await watermarkAsync(req, res);
}
