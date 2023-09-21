import { Op } from 'sequelize';

import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { Credentials } from '../Database/Dto/create-account';
import { createHash } from 'crypto';

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account) private readonly AccountModel) {}

  async createAccount(data: Credentials) {
    const hash = createHash('sha256').update(data.password);
    data.password = hash.digest('hex');

    const isRoot = !(await this.isRootAccount());
    const isAccountExists = await this.doesExists(data.username, data.email);
    if (isAccountExists) {
      return {
        message: 'Account already exists',
      };
    }

    this.AccountModel.create({
      username: data.username,
      password: data.password,
      email: data.email,
    });

    return {
      success: true,
      username: data.username,
      email: data.email,
      isRoot,
    };
  }

  async doesExists(username: string, email: string) {
    const account = await this.AccountModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    return !!account;
  }

  async isRootAccount() {
    const account = await this.AccountModel.findOne();
    return !!account;
  }
}
