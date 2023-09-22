import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '../Database/Models/account.model';

@Module({
  imports: [SequelizeModule.forFeature([Account])],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
