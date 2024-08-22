import { Request, Response } from 'express';
import {
  errorResponseModel,
  responseModel,
} from '../../helpers/methods/responseModel';
import { statusCodeEnum } from '../../helpers/enums/StatusCodeEnum';
import { ValidTokenAsyncResponseDto } from '../../dtos/token';

export async function validTokenAsync(req: Request, res: Response) {
  try {
    let response: ValidTokenAsyncResponseDto = {
      validToken: true,
    };

    return responseModel({
      req,
      res,
      status: statusCodeEnum.SUCCESS,
      content: response,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `validTokenAsync|${err}`,
    });
  }
}
