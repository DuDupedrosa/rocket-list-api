import { Request, Response } from 'express';
import { createTaskValidatorSchema } from '../../validatorSchemas/task/createTaskValidatorSchema';
import { validatorSchemaResponse } from '../../helpers/methods/validatorSchemaResponse';
import userModel from '../../models/user/userModel';
import {
  errorResponseModel,
  responseModel,
} from '../../helpers/methods/responseModel';
import { statusCodeEnum } from '../../helpers/enums/StatusCodeEnum';
import { CreateTaskDto, UpdatedTaskResponseDto } from '../../dtos/task';
import { v4 as uuidv4 } from 'uuid';
import { taskModel } from '../../models/task/taskModel';
import { updateTaskValidatorSchema } from '../../validatorSchemas/task/updateTaskValidatorSchema';
import { taskStatusEnum } from '../../helpers/enums/TaskEnum';

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

    const tasks = await taskModel.find({ userId: user.id });

    if (tasks && tasks.length > 0) {
      const pendingTasks = tasks.filter(
        (task) => task.status === taskStatusEnum.PENDING
      );

      if (pendingTasks.length === 5) {
        return errorResponseModel({
          req,
          res,
          message: 'max_limit_five_tasks',
          status: statusCodeEnum.BAD_REQUEST,
        });
      }
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
    const { status, page, limit } = req.query;
    const pageLimit: number = limit ? Number(limit) : 5;
    const pageNumber: number = page ? Number(page) : 1;

    const user = await userModel.findOne({ id: userId });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        message: `Not found user by id`,
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    const query: any = { userId: user.id };
    if (status) {
      query.status = status;
    }

    const totalItems = await taskModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageLimit);

    const tasks = await taskModel
      .find(query)
      .skip((pageNumber - 1) * pageLimit)
      .limit(pageLimit);

    return responseModel({
      req,
      res,
      content: {
        items: tasks,
        totalItems,
        totalPages,
        currentPage: pageNumber,
      },
      status: statusCodeEnum.SUCCESS,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `getTaskByUserIdAsync|${err}`,
    });
  }
}

export async function updateTaskAsync(req: Request, res: Response) {
  try {
    const { error } = updateTaskValidatorSchema.validate(req.body);

    if (error) {
      return validatorSchemaResponse({ req, res, error });
    }

    const { userId, id, value, status } = req.body;

    const task = await taskModel.findOne({ id });

    if (!task) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.NOT_FOUND,
        message: 'Not found task by id or br user id',
      });
    }

    // validando se o usuário não está tentando editar a task de outro usuário
    if (task.userId !== userId) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.UNAUTHORIZED,
        message: `User not allowed to do this action`,
      });
    }

    const updatedTask = await taskModel.findOneAndUpdate(
      { id },
      {
        value,
        status,
        updateAt: new Date(),
      },
      { runValidators: true, new: true }
    );

    if (!updatedTask) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.INTERNAL_SERVER_ERRO,
        message: `updateTaskAsync|ErrorOnUpdateTaskModel`,
      });
    }

    let response: UpdatedTaskResponseDto = {
      id,
      value: updatedTask.value,
      status: updatedTask.status,
      updateAt: updatedTask.updateAt,
      createdAt: updatedTask.createdAt,
      createdBy: updatedTask.createdBy,
      updateBy: updatedTask.updateBy,
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
      message: `updateTaskAsync|${err}`,
    });
  }
}

export async function deleteTaskAsync(req: Request, res: Response) {
  try {
    const { id, userId } = req.params;

    const task = await taskModel.findOne({ id });

    if (!task) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.NOT_FOUND,
        message: 'Not found task by id',
      });
    }

    // validando se o usuário não está tentando deletar a task de outro usuário
    if (task.userId !== userId) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.UNAUTHORIZED,
        message: `User not allowed to do this action`,
      });
    }

    const deletedTask = await taskModel.findOneAndDelete({ id });

    if (!deletedTask) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.INTERNAL_SERVER_ERRO,
        message: 'deleteTaskAsync|ErrorOnDeleteTaskModel',
      });
    }

    return responseModel({
      req,
      res,
      status: statusCodeEnum.SUCCESS,
      content: '',
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `deleteTaskAsync|${err}`,
    });
  }
}
