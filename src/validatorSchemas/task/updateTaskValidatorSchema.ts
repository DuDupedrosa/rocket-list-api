import Joi from 'joi';
import { taskStatusEnum } from '../../helpers/enums/TaskEnum';

export const updateTaskValidatorSchema = Joi.object({
  id: Joi.string().required(),
  value: Joi.string().required(),
  status: Joi.number()
    .valid(taskStatusEnum.PENDING, taskStatusEnum.COMPLETED)
    .required(),
  userId: Joi.string().required(),
});
