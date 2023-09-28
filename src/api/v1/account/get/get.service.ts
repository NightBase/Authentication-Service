import { Op } from 'sequelize';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Account } from '../../../common/Database/Models/account.model';
import { AuthZPermission } from '../../authorization/permission/permission.service';
import { TokenService } from '../../token/token.service';

@Injectable()
export class AccountGetService {
  constructor(
    @InjectModel(Account) private readonly accountModel,
    private readonly tokenService: TokenService,
    private readonly authZPerm: AuthZPermission,
  ) {}

  async getAccount(identifier: string) {
    const account = await this.accountModel.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
    return !!account;
  }

  async getRootAccount() {
    const account = await this.accountModel.findOne({
      where: {
        isRoot: true,
      },
    });
    return account;
  }
}
