import { NextFunction, Request, Response } from 'express';

import { AUTHENTICATION_SERVICE_NAME } from '@/utils/constants';
import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { TokenService } from '../token/token.service';

@Injectable()
export class IsTokenValid implements NestMiddleware {
  constructor(
    @Inject(AUTHENTICATION_SERVICE_NAME)
    private readonly tokenService: TokenService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization === undefined) return next();

    const [type, token]: string[] = req.headers.authorization.split(' ');
    if (type !== 'Bearer') {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid token type',
      });
    }
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Missing token',
      });
    }
    const isValidToken = await this.tokenService.isValid(token);

    if (!isValidToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid token',
        logout: true,
      });
    }

    next();
  }
}
