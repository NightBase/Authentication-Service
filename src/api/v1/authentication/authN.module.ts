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
import { Account } from '../Database/Models/account.model';
import { Permission, Role } from '../Database/Models/role.model';
import { Database } from '../Database/Models/database.model';
import { AuthService } from './authN.service';
import { AuthController } from './authN.controller';
import { LoginMiddleware } from '../middleware/login.middleware';

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
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes({
      path: 'v1/auth/login',
      method: RequestMethod.POST,
    });
  }
}
