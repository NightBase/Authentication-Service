import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { Credentials } from '../Database/Dto/create-account';

@Controller('v1/user')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('Pawn:CreateAccount')
  async createAccountHandler(data: Credentials) {
    return await this.accountService.createAccount(data);
  }
}
