import { SessionData } from '@/utils/global';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Account } from '../../common/Database/Models/account.model';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [TokenController],
  providers: [TokenService, SessionData],
  exports: [TokenService, SessionData],
})
export class TokenModule {}
