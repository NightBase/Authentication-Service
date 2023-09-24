import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BROKERS,
  AUTHENTICATION_SERVICE_NAME,
  AUTHENTICATION_QUEUE_NAME,
} from '@/utils/constants';

// V1
import { AccountController } from './account.controller';
import { AccountCreateService } from './create/create.service';

// Models
import { Account } from '../../common/Database/Models/account.model';
import { Permission, Role } from '../../common/Database/Models/role.model';
import { Database } from '../../common/Database/Models/database.model';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTHENTICATION_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: BROKERS,
          queue: AUTHENTICATION_QUEUE_NAME,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    SequelizeModule.forFeature([Account, Permission, Role, Database]),
  ],
  controllers: [AccountController],
  providers: [AccountCreateService],
})
export class AccountModule {}
