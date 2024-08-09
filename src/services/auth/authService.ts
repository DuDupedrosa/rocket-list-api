import { Request, Response } from 'express';
import { statusCodeEnum } from '../../helpers/enums/StatusCodeEnum';
import userModel from '../../models/user/userModel';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateEmail } from '../../helpers/validators/validateEmail';
import { validatePassword } from '../../helpers/validators/validatePassword';
import { userRegisterValidatorSchema } from '../../validatorSchemas/auth/userRegisterValidatorSchema';
import { userSignInValidatorSchema } from '../../validatorSchemas/auth/userSignInValidatorSchema';
import { validatorSchemaResponse } from '../../helpers/methods/validatorSchemaResponse';
import {
  errorResponseModel,
  responseModel,
} from '../../helpers/methods/responseModel';
import {
  UserRegisterDto,
  UserRegisterResponseDto,
  UserSignInResponseDto,
} from '../../dtos/auth';

dotenv.config();
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY
  ? process.env.JWT_TOKEN_SECRET_KEY
  : '';

export async function userRegisterAsync(req: Request, res: Response) {
  try {
    // validating dto
    const { error, value } = userRegisterValidatorSchema.validate(req.body);

    if (error) {
      return validatorSchemaResponse({ req, res, error });
    }

    const { email, name, password, lastName } = req.body;

    const alreadyRegisterEmail = await userModel.findOne({ email });

    // validando se já existe um usuário com o email informado
    if (alreadyRegisterEmail) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: 'email_already_register',
      });
    }

    // validating email
    if (!validateEmail(email)) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: 'invalid_email',
      });
    }

    // validating password
    // validatePassword return a true value or a object's error message
    if (validatePassword(password) !== true) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: validatePassword(password),
      });
    }

    // password to hash
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: UserRegisterDto = {
      email,
      name,
      password: hashedPassword,
      id: uuidv4(),
      lastName: lastName ? lastName : null,
    };

    // case uuid don't generate the user id
    if (!newUser.id) {
      return errorResponseModel({
        req,
        res,
        status: statusCodeEnum.BAD_REQUEST,
        message: 'user_id_required',
      });
    }

    // create user in data base
    const createdUser = await userModel.create(newUser);

    // generate user token
    const token = jwt.sign({ userId: newUser.id, email: email }, jwtSecretKey, {
      expiresIn: '30min',
    });

    // create response's object
    const response: UserRegisterResponseDto = {
      user: {
        name,
        email,
        id: newUser.id,
      },
      token,
    };

    return responseModel({
      req,
      res,
      status: statusCodeEnum.CREATED,
      content: response,
    });
  } catch (err) {
    return errorResponseModel({
      req,
      res,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
      message: `userRegisterAsync|${err}`,
    });
  }
}

export async function userSignInAsync(req: Request, res: Response) {
  try {
    const { error, value } = userSignInValidatorSchema.validate(req.body);

    if (error) {
      return validatorSchemaResponse({ req, res, error });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return errorResponseModel({
        req,
        res,
        message: 'invalid_email_or_password',
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    const samePassword = await bcrypt.compare(password, user.password);

    if (!samePassword) {
      return errorResponseModel({
        req,
        res,
        message: 'invalid_email_or_password',
        status: statusCodeEnum.NOT_FOUND,
      });
    }

    // generate user token
    const token = jwt.sign({ userId: user.id, email: email }, jwtSecretKey, {
      expiresIn: '30min',
    });

    const response: UserSignInResponseDto = {
      user: {
        email,
        name: user.name,
        lastName: user.lastName,
        id: user.id,
      },
      token,
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
      message: `userSignInAsync|${err}`,
      status: statusCodeEnum.INTERNAL_SERVER_ERRO,
    });
  }
}
