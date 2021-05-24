import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<void> {
    return this.userRepository.signUp(registerCredentialsDto);
  }

  async singIn(loginCredentialsDto: LoginCredentialsDto): Promise<void> {
    const validated = await this.userRepository.validateUserPassword(
      loginCredentialsDto,
    );

    if (!validated) {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }
}
