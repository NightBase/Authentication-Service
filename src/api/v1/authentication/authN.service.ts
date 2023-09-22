import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../Database/Dto/login.dto';
import { createHash } from 'crypto';

import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account) private accountModel: typeof Account,
    private jwtService: JwtService,
  ) {}

  isTokenValid(token: string) {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      return false;
    }
  }

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

    const token = this.jwtService.sign({
      id: account.id,
      username: account.username,
    });

    return token;
  }
}
