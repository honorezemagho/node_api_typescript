import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@EntityRepository()
export class TaskRepository extends Repository<TaskEntity> {}
