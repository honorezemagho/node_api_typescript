import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    if (status) {
      return this.tasks.filter((task) => task.status === status);
    }

    return !search
      ? this.tasks
      : this.tasks.filter(
          (task) =>
            task.title.includes(search) || task.description.includes(search),
        );
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
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
    const searchTask = this.tasks.find((task) => task.id == id);

    const checkStatus = Object.values(TaskStatus).includes(status);

    !checkStatus ? '' : (searchTask.status = status);

    return searchTask;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id != id);
    return 'Task deleted successfully';
  }
}
