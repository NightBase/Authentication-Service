import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './authN.service';
import { LoginDto } from '../../common/Database/Dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('NB-Auth:Login')
  async createAccountHandler(data: LoginDto) {
    return this.authService.login(data);
  }

  @HttpCode(201)
  @Post('login')
  async login(@Body() data: LoginDto, @Res() response: any) {
    const loginData: any = await this.authService.login(data);

    response.cookie('accessToken', loginData.token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
    });
    response.cookie('refreshToken', loginData.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
    });
    return response.status(200).send(loginData);
  }
}
