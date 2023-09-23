const sessionExpr = 10000;
export class SessionData {
  public readonly sessions = {};
  public readonly refreshTokens = {};

  public setSession(key: string, value: any) {
    this.sessions[key] = {
      value,
      expires: Date.now() + sessionExpr,
    };
    this.refreshTokens[value.refreshToken] = key;
  }

  public getSession(key: string) {
    const session = this.sessions[key];
    if (session) {
      return session;
    }
    return null;
  }

  public isExpired(key: string) {
    const session = this.sessions[key];
    if (session) {
      return session.expires < Date.now();
    }
    return true;
  }

  public findTokenFromRefreshToken(key: string) {
    const session = this.refreshTokens[key];
    if (session) {
      return session;
    }
    return null;
  }

  public deleteSession(key: string) {
    const session = this.sessions[key];
    if (session) {
      delete this.sessions[key];
    }
  }
}
