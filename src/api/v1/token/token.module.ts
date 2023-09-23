import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../Database/Models/account.model';
import { RefreshToken } from '../Database/Models/token.model';
import { SessionData } from '@/utils/global';

@Module({
  imports: [SequelizeModule.forFeature([Account, RefreshToken])],
  controllers: [TokenController],
  providers: [TokenService, SessionData],
  exports: [TokenService],
})
export class TokenModule {}
