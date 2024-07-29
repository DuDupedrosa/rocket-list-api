import Joi from 'joi';

export const updateUserValidatorSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  id: Joi.string().required(),
  lastName: Joi.string().allow(null),
});
