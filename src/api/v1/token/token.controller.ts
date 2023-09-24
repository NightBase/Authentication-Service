import { TokenService } from './token.service';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('v1/auth/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  checkToken() {
    return 'Token service is running';
  }

  @MessagePattern('NB-Auth:CreateToken')
  async createTokenHandler(data: any) {
    return this.tokenService.createToken(data);
  }

  @MessagePattern('NB-Auth:IsTokenExpired')
  async isTokenExpiredHandler(token: string) {
    return this.tokenService.isExpired(token);
  }

  @MessagePattern('NB-Auth:IsTokenValid')
  async isTokenValidHandler(token: string) {
    return this.tokenService.isValid(token);
  }

  @MessagePattern('NB-Auth:RefreshToken')
  async refreshTokenHandler(token: string) {
    return this.tokenService.refreshToken(token);
  }

  @MessagePattern('NB-Auth:IsTokenRevoked')
  async isTokenRevokedHandler(token: string) {
    return this.tokenService.isRevoked(token);
  }

  @MessagePattern('NB-Auth:RevokeToken')
  async revokeTokenHandler(token: string) {
    return this.tokenService.revokeToken(token);
  }

  @MessagePattern('NB-Auth:WhoAmI')
  async whoAmIHandler(token: string) {
    return this.tokenService.whoAmI(token);
  }
}
