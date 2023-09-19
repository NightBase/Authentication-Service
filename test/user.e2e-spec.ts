import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Service V1', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('[POST] Should return 400 when creating a user without credentials', async () => {
    await request(app.getHttpServer()).post('/v1/user').expect(400);
  });

  it('[POST] Should successfully create a root user', async () => {
    const credentials = {
      username: 'JohnDoe',
      email: 'JohnDoe@example.com',
      password: '12345',
      isRoot: 'true',
    };

    await request(app.getHttpServer())
      .post('/v1/user')
      .send(credentials)
      .expect(201);
  });

  it('[POST] Should return 400 when creating a 2nd root user', async () => {
    const credentials = {
      username: 'JohnDoe2',
      email: 'JohnDoe2@example.com',
      password: '12345',
      isRoot: 'true',
    };

    await request(app.getHttpServer())
      .post('/v1/user')
      .send(credentials)
      .expect(400);
  });

  it('[POST] Should return 401 when creating a user without authorization', async () => {
    const credentials = {
      username: 'JohnDoe2',
      email: 'JohnDoe2@example.com',
      password: '12345',
    };

    await request(app.getHttpServer())
      .post('/v1/user')
      .send(credentials)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
