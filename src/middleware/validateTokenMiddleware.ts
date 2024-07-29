import { NextFunction, Request, Response } from 'express';
import { statusCodeEnum } from '../helpers/enums/StatusCodeEnum';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Ou defina um tipo mais específico conforme sua necessidade
  }
}

dotenv.config();
const jwtSecretKey = process.env.JWT_TOKEN_SECRET_KEY
  ? process.env.JWT_TOKEN_SECRET_KEY
  : '';

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(statusCodeEnum.UNAUTHORIZED).json({
      message: 'Access denied. No token provided.',
      statusCode: statusCodeEnum.UNAUTHORIZED,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.user = decoded; // Adicione informações do usuário à requisição
    next();
  } catch (err) {
    return res.status(statusCodeEnum.UNAUTHORIZED).json({
      message: 'Invalid token.',
      statusCode: statusCodeEnum.UNAUTHORIZED,
    });
  }
}
