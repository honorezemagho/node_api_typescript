import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(registerCredentialsDto: RegisterCredentialsDto) {
    const { username, email, password } = registerCredentialsDto;

    const result: User | null = await this.findOne({
      where: [{ email, username }, { username }, { email }],
    });

    if (result) {
      throw new ConflictException('username or email already exist');
    }

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
