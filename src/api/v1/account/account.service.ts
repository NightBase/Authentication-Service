import { Op } from 'sequelize';

import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { Credentials } from '../Database/Dto/create.dto';
import { createHash } from 'crypto';

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account) private readonly accountModel) {}

  async createAccount(data: Credentials) {
    const hash = createHash('sha256').update(data.password);
    data.password = hash.digest('hex');

    const isRoot = !(await this.isRootAccount());
    const authState = await this.isAuthenticated();

    // If the account is not root and the user is not authenticated
    // then we can't create an account
    if (!isRoot && !authState) {
      return new HttpException(
        'You must authenticate to create an account',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // If the account exists then we can't create an account
    const isAccountExists = await this.doesExists(data.username, data.email);
    if (isAccountExists) {
      return new HttpException('Account already exists', HttpStatus.CONFLICT);
    }

    // All checks passed, we can create the account
    this.accountModel.create({
      username: data.username,
      password: data.password,
      email: data.email,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Account created successfully',
      username: data.username,
      email: data.email,
      isRoot,
    };
  }

  async doesExists(username: string, email: string) {
    const account = await this.accountModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    return !!account;
  }

  async isRootAccount() {
    const account = await this.accountModel.findOne();
    return !!account;
  }

  async isAuthenticated() {
    return false;
  }
}
