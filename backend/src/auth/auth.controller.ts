import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface LoginDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterDto {
  username: string;
  email?: string;
  password: string;
  name: string;
  role?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const identifier = body.username ?? body.email ?? '';
    const password = body.password ?? '';
    return this.authService.login(identifier, password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
