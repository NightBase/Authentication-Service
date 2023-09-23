import { InjectModel } from '@nestjs/sequelize';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { SessionData } from '@/utils/global';
import { generateRandomString } from '@/utils/stringUtils';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Account) private accountModel: typeof Account,
    @Inject(SessionData) private sessionData: SessionData,
  ) {}

  async createToken(account: Account) {
    const token = generateRandomString(64);
    const refreshToken = generateRandomString(64);

    this.sessionData.setSession(token, {
      id: account.id,
      username: account.username,
      refreshToken,
    });
    return [token, refreshToken];
  }

  async refreshToken(refreshToken: string) {
    const refToken = this.sessionData.findTokenFromRefreshToken(refreshToken);
    if (!refToken) {
      return new HttpException(
        {
          message: 'Invalid token',
          logout: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    this.sessionData.deleteSession(refToken);
    const token = generateRandomString(64);
    this.sessionData.setSession(token, {
      id: refToken.id,
      username: refToken.username,
      refreshToken,
    });
    return token;
  }

  async isValid(token: string) {
    const session = this.sessionData.getSession(token);
    if (!session) {
      return new HttpException(
        {
          message: 'Token not found in session data',
          logout: true,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  async isExpired(token: string) {
    const expired = this.sessionData.isExpired(token);
    return expired;
  }

  isRevoked(token: string) {
    const session = this.sessionData.getSession(token);
    if (!session) {
      return true;
    }
    return false;
  }

  async revokeToken(token: string) {
    return this.sessionData.deleteSession(token);
  }
}
