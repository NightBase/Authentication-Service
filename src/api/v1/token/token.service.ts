import { SessionData } from '@/utils/global';
import { generateRandomString } from '@/utils/stringUtils';
import { Inject, Injectable } from '@nestjs/common';

import { Account } from '../../common/Database/Models/account.model';

@Injectable()
export class TokenService {
  constructor(@Inject(SessionData) private sessionData: SessionData) {}

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
      return null;
    }
    const token = generateRandomString(64);
    const oldSession = this.sessionData.getSession(refToken);

    this.sessionData.setSession(token, {
      id: oldSession.value.id,
      username: oldSession.value.username,
      refreshToken,
    });
    this.revokeToken(refToken);
    return token;
  }

  async isValid(token: string) {
    const session = this.sessionData.getSession(token);
    if (!session) {
      return false;
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

  async whoAmI(token: string) {
    const session = this.sessionData.getSession(token);
    if (!session) {
      return null;
    }
    return session.value.username;
  }
}
