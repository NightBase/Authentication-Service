import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TokenService } from './token.service';

@Controller('v1/auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  checkToken() {
    return 'Token service is running';
  }

  @MessagePattern('NB-Auth:IsTokenValid')
  async isTokenValidHandler(token: string) {
    return this.tokenService.isTokenValid(token);
  }
}
