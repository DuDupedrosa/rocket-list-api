import { Request, Response } from 'express';
import userModel from '../../models/user/userModel';
import { statusCodeEnum } from '../../helpers/enums/StatusCodeEnum';
import { GetUserResponseDto, UpdateUserResponseDto } from '../../dtos/user';
import {
  errorResponseModel,
  responseModel,
} from '../../helpers/methods/responseModel';
import { updateUserValidatorSchema } from '../../validatorSchemas/user/updateUserValidatorSchema';
import { validatorSchemaResponse } from '../../helpers/methods/validatorSchemaResponse';
import { taskModel } from '../../models/task/taskModel';

export async function getUserAsync(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: 'Required user id params',
      });
    }

    const userData = await userModel.findOne({ id: userId });

    if (userData) {
      const { name, lastName, email, id } = userData;

      const response: GetUserResponseDto = {
        name,
        lastName,
        email,
        id,
      };

      return responseModel({
        req,
        res,
        status: statusCodeEnum.SUCCESS,
        content: response,
      });
    }

    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.NOT_FOUND,
      message: 'User id not found',
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `userProfileService|${err}`,
    });
  }
}

export async function updateUserAsync(req: Request, res: Response) {
  try {
    const { error } = updateUserValidatorSchema.validate(req.body);

    if (error) {
      return validatorSchemaResponse({ req, res, error });
    }

    const { id, name, email, lastName } = req.body;

    const user = await userModel.findOne({ id: id });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        message: 'Not found user',
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    const userUpdated = await userModel.findOneAndUpdate(
      { id: id },
      {
        name: name,
        email: email,
        lastName: lastName !== undefined ? lastName : null,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!userUpdated) {
      return errorResponseModel({
        req,
        res,
        message: `Internal server error|updateUserAsync`,
        status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      });
    }

    const response: UpdateUserResponseDto = {
      name: userUpdated.name,
      email: userUpdated.email,
      lastName: userUpdated.lastName,
      id: userUpdated.id,
    };

    return responseModel({
      req,
      res,
      content: response,
      status: statusCodeEnum.SUCCESS,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `updateUserAsync|${err}`,
    });
  }
}

export async function deleteUserAsync(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    if (!userId) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: 'Required user id params',
      });
    }
    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.NOT_FOUND,
        message: 'Not found user',
      });
    }

    const userDeleted = await userModel.deleteOne({ id: userId });
    const userTasksDeleted = await taskModel.deleteMany({ userId: userId });

    return responseModel({
      req,
      res,
      status: statusCodeEnum.SUCCESS,
      content: 'User deleted with success',
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: 'deleteUserAsync|${err}',
    });
  }
}
