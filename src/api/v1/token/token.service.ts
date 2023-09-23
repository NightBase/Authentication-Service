import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../Database/Models/token.model';

// TODO: Implement passport.js for session

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Account) private accountModel: typeof Account,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
  ) {}

  async createToken(account: Account) {
    const token = this.jwtService.sign({
      id: account.id,
      username: account.username,
    });

    const refreshToken = this.jwtService.sign(
      {
        id: account.id,
        username: account.username,
      },
      {
        expiresIn: '7d',
      },
    );

    await this.revokeToken(account.id);
    await this.refreshTokenModel.create({
      accountId: account.id,
      token,
      refreshToken,
    });

    return [token, refreshToken];
  }

  async refreshToken(token: string) {
    const tokenFromDB = await this.refreshTokenModel.findOne({
      where: {
        refreshToken: token,
      },
    });
    if (!tokenFromDB) {
      return new HttpException(
        {
          message: 'Invalid token',
          logout: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newToken = this.jwtService.sign({
      id: tokenFromDB.accountId,
    });

    await this.refreshTokenModel.update(
      {
        token: newToken,
      },
      {
        where: {
          refreshToken: token,
        },
      },
    );
    return newToken;
  }

  async isValid(token: string) {
    const tokenFromDB = await this.refreshTokenModel.findOne({
      where: {
        token,
      },
    });

    if (!tokenFromDB) {
      return new HttpException(
        {
          message: 'Invalid token',
          logout: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  async isExpired(token: string) {
    try {
      this.jwtService.verify(token);
      return false;
    } catch (e) {
      return true;
    }
  }

  isRevoked(token: string) {
    const tokenFromDB = this.refreshTokenModel.findOne({
      where: {
        token,
      },
    });

    if (!tokenFromDB) {
      return true;
    }
    return false;
  }

  async revokeToken(accountId: string) {
    return await this.refreshTokenModel.destroy({
      where: {
        accountId,
      },
    });
  }
}
