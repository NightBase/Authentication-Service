import { Account } from '@/api/common/Database/Models/account.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TokenModule } from '../token/token.module';
import { AuthZController } from './authZ.controller';
import { AuthZPermission } from './permission/permission.service';

@Module({
  imports: [TokenModule, SequelizeModule.forFeature([Account])],
  controllers: [AuthZController],
  providers: [AuthZPermission],
  exports: [AuthZPermission],
})
export class AuthZModule {}
