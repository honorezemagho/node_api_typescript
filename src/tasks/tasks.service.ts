import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskModel } from './task.model';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  private tasks: TaskModel[] = [];

  getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): TaskModel[] {
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

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTask(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number) {
    const result = await this.taskRepository.destroyTask(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return 'Task deleted successfully';
  }
}
