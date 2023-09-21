import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModule } from './api/v1/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import {
  AUTHENTICATION_QUEUE_NAME,
  AUTHENTICATION_SERVICE_NAME,
  BROKERS,
  DATABASE_NAME,
} from './utils/constants';
import { AccountModule } from './api/v1/account/account.module';
import { AuthModule } from './api/v1/authentication/authN.module';
import { IsTokenValid } from './api/v1/middleware/token.middleware';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TokenModule,
    AccountModule,
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
      logging: false,
      dialectOptions: {
        application_name: 'NightBase-Authentication',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
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
  ],
})
export class AppModule {}
