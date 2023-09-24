import { Request, Response, NextFunction } from 'express';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { LoginDto } from '../../common/Database/Dto/login.dto';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body: LoginDto = req.body;
    if (!body.identifier || !body.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Missing credentials',
      });
    }
    next();
  }
}
