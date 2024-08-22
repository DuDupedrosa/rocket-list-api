import { Request, Response } from 'express';
import { validTokenAsync } from '../../services/token/tokenService';

export async function validTokenController(req: Request, res: Response) {
  await validTokenAsync(req, res);
}
