import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Task } from 'src/tasks/task.entity';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(registerCredentialsDto: RegisterCredentialsDto) {
    const { username, email, password } = registerCredentialsDto;

    // Check if username or email already exist
    const result: User | null = await this.findOne({
      where: [{ email, username }, { username }, { email }],
    });

    // throw exception if already existing
    if (result) {
      throw new ConflictException('username or email already exist');
    }

    // Create new User
    const user = new User();
    user.username = username;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<string> {
    const { username, password } = loginCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }
}
