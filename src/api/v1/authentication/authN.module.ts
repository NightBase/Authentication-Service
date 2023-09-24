import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BROKERS,
  AUTHENTICATION_SERVICE_NAME,
  AUTHENTICATION_QUEUE_NAME,
} from '@/utils/constants';

// Models
import { Account } from '../../common/Database/Models/account.model';
import { Permission, Role } from '../../common/Database/Models/role.model';
import { Database } from '../../common/Database/Models/database.model';

import { LoginService } from './login/login.service';
import { AuthController } from './authN.controller';
import { LoginMiddleware } from '../middleware/login.middleware';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    TokenModule,
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
  controllers: [AuthController],
  providers: [LoginService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes({
      path: 'v1/auth/login',
      method: RequestMethod.POST,
    });
  }
}
