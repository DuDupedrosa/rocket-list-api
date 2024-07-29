import { Response, Request } from 'express';

interface ResponseModel {
  req: Request;
  res: Response;
  status: number;
  content: any;
}
export function responseModel({ req, res, status, content }: ResponseModel) {
  res.status(status).json({ content, statusCode: status });
}

interface ErrorResponseModel {
  req: Request;
  res: Response;
  status: number;
  message: any;
}
export function errorResponseModel({
  req,
  res,
  status,
  message,
}: ErrorResponseModel) {
  res.status(status).json({ message, statusCode: status });
}
