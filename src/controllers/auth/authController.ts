import { Response, Request } from 'express';
import {
  userRegisterAsync,
  userSignInAsync,
} from '../../services/auth/authService';

export async function userRegisterController(req: Request, res: Response) {
  await userRegisterAsync(req, res);
}

export async function userSignInController(req: Request, res: Response) {
  await userSignInAsync(req, res);
}
