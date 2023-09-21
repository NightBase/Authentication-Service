import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './authN.service';
import { LoginDto } from '../Database/Dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('NB-Auth:Login')
  async createAccountHandler(data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
