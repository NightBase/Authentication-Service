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
import { AccountService } from './account.service';

// Models
import { Account } from '../Database/Models/account.model';
import { Permission, Role } from '../Database/Models/role.model';
import { Database } from '../Database/Models/database.model';

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
  providers: [AccountService],
})
export class AccountModule {}
