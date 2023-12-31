import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { Account } from '../../common/Database/Models/account.model';
import { Database } from '../../common/Database/Models/database.model';
import { Permission, Role } from '../../common/Database/Models/role.model';
import { LoginMiddleware } from '../middleware/login.middleware';
import { TokenModule } from '../token/token.module';
import { AuthController } from './authN.controller';
import { LoginService } from './login/login.service';

@Module({
  imports: [
    TokenModule,
    SequelizeModule.forFeature([Account, Permission, Role, Database]),
  ],
  controllers: [AuthController],
  providers: [LoginService],
})
export class AuthNModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes({
      path: 'v1/auth/login',
      method: RequestMethod.POST,
    });
  }
}
