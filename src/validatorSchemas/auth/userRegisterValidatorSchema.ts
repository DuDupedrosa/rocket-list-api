import Joi from 'joi';

export const userRegisterValidatorSchema = Joi.object({
  name: Joi.string().required(),
  lastName: Joi.string().allow(null),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
});
