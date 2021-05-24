import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TasksStatusValidationPipe implements PipeTransform {
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(
        `${value} is an invalid status. Please choose DONE,IN_PROGRESS or OPEN`,
      );
    }
    return value;
  }

  private isStatusValid(status: any) {
    return Object.values(TaskStatus).includes(status);
  }
}
