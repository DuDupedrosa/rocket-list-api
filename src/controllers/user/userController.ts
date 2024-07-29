import { Request, Response } from 'express';
import { getUserAsync, updateUserAsync } from '../../services/user/userService';

export async function getUserController(req: Request, res: Response) {
  await getUserAsync(req, res);
}

export async function updateUserController(req: Request, res: Response) {
  await updateUserAsync(req, res);
}
