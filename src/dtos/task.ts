export type CreateTaskDto = {
  id: string;
  userId: string;
  status: number;
  value: string;
  createdAt: Date;
  createdBy: string;
  updateAt: Date;
  updateBy: string;
};
