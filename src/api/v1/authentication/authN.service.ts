import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '../../common/Database/Models/account.model';
import { LoginDto } from '../../common/Database/Dto/login.dto';
import { createHash } from 'crypto';

import { Op } from 'sequelize';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @InjectModel(Account) private accountModel: typeof Account,
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

    const [token, refreshToken] = await this.tokenService.createToken(account);

    return {
      token,
      refreshToken,
    };
  }
}
