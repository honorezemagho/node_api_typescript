import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Getuser } from 'src/auth/get-user.decorator';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    filterDto: GetTasksFilterDto,
    @Getuser() user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) like LOWER(:search) OR  LOWER(task.description)  like LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    return query.getMany();
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);

    return task;
  }

  async destroyTask(id: number, user: User) {
    return this.delete({ id, user });
  }
}
