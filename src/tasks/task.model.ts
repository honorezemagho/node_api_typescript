import { TaskStatus } from './task-status.enum';

export interface TaskModel {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}
