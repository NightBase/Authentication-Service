import { Request, Response, NextFunction } from 'express';
import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { AUTHENTICATION_SERVICE_NAME } from '@/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IsTokenValid implements NestMiddleware {
  constructor(
    @Inject(AUTHENTICATION_SERVICE_NAME)
    private readonly authQueue: ClientProxy,
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

    const isValidToken = await lastValueFrom(
      this.authQueue.send('NB-Auth:IsTokenValid', token),
    );

    if (!isValidToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid token',
        logout: true,
      });
    }

    next();
  }
}
