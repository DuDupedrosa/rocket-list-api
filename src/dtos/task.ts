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

export type UpdatedTaskResponseDto = {
  id: string;
  value: string;
  status: number;
  createdAt: Date;
  createdBy: string;
  updateAt: Date;
  updateBy: string;
};
