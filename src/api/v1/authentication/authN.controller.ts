import { Body, Controller, Post, Res } from '@nestjs/common';
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
  async login(@Body() data: LoginDto, @Res() response: any) {
    const loginData: any = await this.authService.login(data);

    response.header('Authorization', `Bearer ${loginData.token}`);
    response.cookie('accessToken', loginData.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    response.cookie('refreshToken', loginData.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return response.status(200).send(loginData.token);
  }
}
