import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Account } from '../Database/Models/account.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Account) private account_model: typeof Account,
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
}
