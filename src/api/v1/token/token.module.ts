import { Module } from '@nestjs/common';
import { SessionData } from '@/utils/global';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenController } from './token.controller';
import { Account } from '../../common/Database/Models/account.model';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [TokenController],
  providers: [TokenService, SessionData],
  exports: [TokenService],
})
export class TokenModule {}
