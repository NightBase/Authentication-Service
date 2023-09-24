import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AccountCreateService } from './create/create.service';
import { Credentials } from '../../common/Database/Dto/create.dto';

@Controller('v1/user')
export class AccountController {
  constructor(private readonly accountCreateService: AccountCreateService) {}

  @MessagePattern('NB-Auth:CreateAccount')
  async createAccountHandler(data: Credentials) {
    return await this.accountCreateService.createAccount(data);
  }
}
