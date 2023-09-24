import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountService } from './account.service';
import { Credentials } from '../../common/Database/Dto/create.dto';

@Controller('v1/user')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @MessagePattern('NB-Auth:CreateAccount')
  async createAccountHandler(data: Credentials) {
    return await this.accountService.createAccount(data);
  }
}
