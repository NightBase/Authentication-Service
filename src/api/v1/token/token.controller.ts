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

  @MessagePattern('NB-Auth:RefreshToken')
  async refreshTokenHandler(token: string) {
    return this.tokenService.refreshToken(token);
  }

  @MessagePattern('NB-Auth:RevokeToken')
  async revokeTokenHandler(token: string) {
    return this.tokenService.revokeToken(token);
  }
}
