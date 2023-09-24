import { Module } from '@nestjs/common';
import { AuthZPermission } from './permission/permission.service';
import { TokenModule } from '../token/token.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '@/api/common/Database/Models/account.model';

@Module({
  imports: [TokenModule, SequelizeModule.forFeature([Account])],
  controllers: [],
  providers: [AuthZPermission],
  exports: [AuthZPermission],
})
export class AuthZModule {}
