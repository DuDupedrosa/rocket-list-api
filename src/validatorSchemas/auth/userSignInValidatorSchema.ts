import Joi from 'joi';

export const userSignInValidatorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
