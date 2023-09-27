import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { Account } from '../../common/Database/Models/account.model';
import { Database } from '../../common/Database/Models/database.model';
import { Permission, Role } from '../../common/Database/Models/role.model';
import { AuthZModule } from '../authorization/authZ.module';
import { TokenModule } from '../token/token.module';
// V1
import { AccountController } from './account.controller';
import { AccountCreateService } from './create/create.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Account, Permission, Role, Database]),
    TokenModule,
    AuthZModule,
  ],
  controllers: [AccountController],
  providers: [AccountCreateService],
})
export class AccountModule {}
