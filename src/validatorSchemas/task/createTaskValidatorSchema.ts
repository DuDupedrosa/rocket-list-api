import Joi from 'joi';
import { taskStatusEnum } from '../../helpers/enums/TaskEnum';

export const createTaskValidatorSchema = Joi.object({
  userId: Joi.string().required(),
  value: Joi.string().required(),
  status: Joi.number()
    .valid(taskStatusEnum.PENDING, taskStatusEnum.COMPLETED)
    .required(),
  //createdAt: Joi.date().required(),
  //updateAt: Joi.date().required(),
});
