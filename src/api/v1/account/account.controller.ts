import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { Credentials } from '../../common/Database/Dto/create.dto';
import { AccountCreateService } from './create/create.service';
import { AccountDeleteService } from './delete/delete.service';

@Controller('v1/user')
export class AccountController {
  constructor(
    private readonly accountCreateService: AccountCreateService,
    private readonly accountDeleteService: AccountDeleteService,
  ) {}

  @MessagePattern('NB-Auth:CreateAccount')
  async createAccountHandler(data: Credentials) {
    return await this.accountCreateService.createAccount(data);
  }

  @MessagePattern('NB-Auth:DeleteAccount')
  async deleteAccountHandler(data: {
    identifier: string;
    accessToken: string;
  }) {
    return await this.accountDeleteService.deleteAccount(data);
  }
}
