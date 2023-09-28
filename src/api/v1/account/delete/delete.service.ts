import { Op } from 'sequelize';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Account } from '../../../common/Database/Models/account.model';
import { AuthZPermission } from '../../authorization/permission/permission.service';
import { TokenService } from '../../token/token.service';
import { AccountGetService } from '../get/get.service';

@Injectable()
export class AccountDeleteService {
  constructor(
    @InjectModel(Account) private readonly accountModel,
    private readonly tokenService: TokenService,
    private readonly authZPerm: AuthZPermission,
    private readonly accountGetService: AccountGetService,
  ) {}

  async deleteAccount(data: { identifier: string; accessToken: string }) {
    const isAuthenticated = await this.isAuthenticated(data.accessToken);
    if (!isAuthenticated) {
      return new HttpException(
        {
          message: 'You must authenticate to delete an account',
          logout: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (isAuthenticated) {
      const hasPermission = await this.authZPerm.hasRootPermission(
        data.accessToken,
      );
      if (!hasPermission) {
        return new HttpException(
          {
            message: 'You do not have permission to delete an account',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const accountExists = await this.accountGetService.getAccount(
      data.identifier,
    );
    if (!accountExists) {
      return new HttpException(
        {
          message: 'This account does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const rootAccount = await this.accountGetService.getRootAccount();
    if (rootAccount.username === data.identifier) {
      return new HttpException(
        {
          message: 'You cannot delete the root account',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.accountModel.destroy({
      where: {
        [Op.or]: [{ username: data.identifier }, { email: data.identifier }],
      },
    });
    return true;
  }

  async isAuthenticated(accessToken: string) {
    const isValid = await this.tokenService.isValid(accessToken);
    if (isValid === true) {
      return true;
    }
    return false;
  }
}
