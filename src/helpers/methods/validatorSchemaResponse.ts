import { Response, Request } from 'express';
import { statusCodeEnum } from '../enums/StatusCodeEnum';
import Joi from 'joi';

interface Props {
  req: Request;
  res: Response;
  error: Joi.ValidationError;
}
export function validatorSchemaResponse({ req, res, error }: Props) {
  res.status(statusCodeEnum.BAD_REQUEST).json({
    message: 'Validation failed',
    statusCode: statusCodeEnum.BAD_REQUEST,
    erros: error.details.map((detail) => detail.message),
  });
}
