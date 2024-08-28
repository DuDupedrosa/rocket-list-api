import Joi from 'joi';

export const userChangePasswordValidatorSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  userId: Joi.string().required(),
});
