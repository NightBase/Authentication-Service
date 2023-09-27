import dotenv from 'dotenv';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { AUTHENTICATION_QUEUE_NAME, BROKERS } from './utils/constants';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: BROKERS,
      queue: AUTHENTICATION_QUEUE_NAME,
      queueOptions: {
        durable: false,
      },
    },
  });

  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 5000);
  console.log(`🚀 Authentication service is running on: ${await app.getUrl()}`);
}
bootstrap();
