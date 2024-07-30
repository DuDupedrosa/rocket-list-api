import mongoose, { Schema } from 'mongoose';
import { taskStatusEnum } from '../../helpers/enums/TaskEnum';

const taskSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  value: { type: String, required: true },
  status: {
    type: Number,
    required: true,
    enum: [taskStatusEnum.PENDING, taskStatusEnum.COMPLETED],
  },
  createdAt: { type: Date, required: true },
  createdBy: { type: String, required: true },
  updateAt: { type: Date, required: true },
  updateBy: { type: String, required: true },
});

export const taskModel = mongoose.model('tasks', taskSchema);
