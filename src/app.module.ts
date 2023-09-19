import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokenModule } from './api/v1/token/token.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TokenModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'NightBase-User',
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
  ],
})
export class AppModule {}
