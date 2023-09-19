import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { TokenService } from './token.service';
import { ACCOUNT_SERVICE_NAME } from '@/utils/constants';

@Controller('v1/token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(ACCOUNT_SERVICE_NAME) private readonly accountQueue: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'isTokenValid' })
  async isTokenValidHandler(token: string) {
    return this.tokenService.isTokenValid(token);
  }
}
