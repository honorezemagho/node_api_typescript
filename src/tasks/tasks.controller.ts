import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskModel } from './task.model';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { ValidationPipe } from '@nestjs/common';
import { TasksStatusValidationPipe } from './pipes/task-status-validation';
import { ParseIntPipe } from '@nestjs/common';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getTasks(@Query() filterDto: GetTasksFilterDto): TaskModel[] {
    return !Object.keys(filterDto).length
      ? this.tasksService.getAllTasks()
      : this.tasksService.getTasksWithFilter(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TasksStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, status);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
