import { Request, Response } from 'express';
import {
  createTaskAsync,
  getTaskByUserIdAsync,
} from '../../services/task/taskService';

export async function createTaskController(req: Request, res: Response) {
  await createTaskAsync(req, res);
}

export async function getTaskByUserIdController(req: Request, res: Response) {
  await getTaskByUserIdAsync(req, res);
}
