import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { LoginDto } from '../Database/Dto/login.dto';
import { createHash } from 'crypto';

import { Op } from 'sequelize';
import { RefreshToken } from '../Database/Models/token.model';
import { AUTHENTICATION_SERVICE_NAME } from '@/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    @Inject(AUTHENTICATION_SERVICE_NAME) private authQueue: ClientProxy,
  ) {}

  async login(data: LoginDto) {
    const hash = createHash('sha256').update(data.password);
    data.password = hash.digest('hex');

    const account = await this.accountModel.findOne({
      where: {
        [Op.or]: [{ email: data.identifier }, { username: data.identifier }],
        password: data.password,
      },
    });

    if (!account) {
      throw new HttpException(
        {
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const [token, refreshToken] = await lastValueFrom(
      this.authQueue.send('NB-Auth:CreateToken', account),
    );

    return {
      token,
      refreshToken,
    };
  }
}
