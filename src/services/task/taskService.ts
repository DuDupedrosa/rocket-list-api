import { Request, Response } from 'express';
import { createTaskValidatorSchema } from '../../validatorSchemas/task/createTaskValidatorSchema';
import { validatorSchemaResponse } from '../../helpers/methods/validatorSchemaResponse';
import userModel from '../../models/user/userModel';
import {
  errorResponseModel,
  responseModel,
} from '../../helpers/methods/responseModel';
import { statusCodeEnum } from '../../helpers/enums/StatusCodeEnum';
import { CreateTaskDto } from '../../dtos/task';
import { v4 as uuidv4 } from 'uuid';
import { taskModel } from '../../models/task/taskModel';

export async function createTaskAsync(req: Request, res: Response) {
  try {
    const { error } = createTaskValidatorSchema.validate(req.body);

    if (error) {
      return validatorSchemaResponse({ req, res, error });
    }

    const { userId, value, status } = req.body;

    //  1 - existe o userId
    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        message: 'Not found user by id',
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    let taskData: CreateTaskDto = {
      id: uuidv4(),
      value,
      status,
      userId,
      createdAt: new Date(),
      createdBy: userId,
      updateAt: new Date(),
      updateBy: userId,
    };

    const createdTask = await taskModel.create(taskData);

    if (!createdTask) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.INTERNAL_SERVER_ERRO,
        message: `createTaskAsync|erroOnCreateTaskModel`,
      });
    }

    return responseModel({
      req,
      res,
      content: createdTask,
      status: statusCodeEnum.CREATED,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `createTaskAsync|${err}`,
    });
  }
}

export async function getTaskByUserIdAsync(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        message: `Not found user by id`,
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    let tasks;

    if (!status) {
      tasks = await taskModel.find({ userId: user.id });
    } else {
      tasks = await taskModel.find({ userId: user.id, status });
    }

    return responseModel({
      req,
      res,
      content: tasks,
      status: statusCodeEnum.SUCCESS,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `getTaskByStatusAsync|${err}`,
    });
  }
}
