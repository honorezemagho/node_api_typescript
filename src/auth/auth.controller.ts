import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto) {
    return this.authService.signUp(registerCredentialsDto);
  }

  @Post('/signin')
  singIn(
    @Body(ValidationPipe) loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(loginCredentialsDto);
  }
}
