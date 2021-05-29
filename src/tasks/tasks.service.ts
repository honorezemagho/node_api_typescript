import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { Getuser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getAllTasks(
    filterDto: GetTasksFilterDto,
    @Getuser() user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, @Getuser() user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(
    id: number,
    status: TaskStatus,
    @Getuser() user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number, user) {
    const result = await this.taskRepository.destroyTask(id, user);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return { message: 'Task deleted  successfully' };
  }
}
