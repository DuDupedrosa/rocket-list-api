import { Request, Response } from 'express';
import {
  createTaskAsync,
  deleteTaskAsync,
  getTaskByUserIdAsync,
  updateTaskAsync,
} from '../../services/task/taskService';

export async function createTaskController(req: Request, res: Response) {
  await createTaskAsync(req, res);
}

export async function getTaskByUserIdController(req: Request, res: Response) {
  await getTaskByUserIdAsync(req, res);
}

export async function updateTaskController(req: Request, res: Response) {
  await updateTaskAsync(req, res);
}

export async function deleteTaskController(req: Request, res: Response) {
  await deleteTaskAsync(req, res);
}
