import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task-dto';
import { UpdateTaskDto } from './dtos/update-task-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id, updateTaskDto: UpdateTaskDto): Task {
    const { status } = updateTaskDto;
    const task = this.tasks.find((task) => task.id == id);
    const checkStatus = Object.values(TaskStatus).includes(status);
    !checkStatus ? '' : (task.status = status);
    return task;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
    return 'Task deleted successfully';
  }
}
