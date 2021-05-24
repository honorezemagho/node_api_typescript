import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(registerCredentialsDto: RegisterCredentialsDto): Promise<void> {
    return this.userRepository.signUp(registerCredentialsDto);
  }
}
