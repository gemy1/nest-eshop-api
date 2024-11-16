import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { DataSource } from 'typeorm';
let dataSource: DataSource;

describe('Auth module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
  });
  afterEach(async () => {
    // Close the database connection if it's open
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should register a new user', async () => {
    const registerUser: CreateUserDto = {
      username: 'gamal',
      password: '111111',
      email: 'g@m.com',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUser)
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('should login the user ', async () => {
    const registerUser: CreateUserDto = {
      username: 'gamal',
      password: '111111',
      email: 'g@m.com',
    };
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUser)
      .expect(201);

    const accessToken = res.body.accessToken;
    const refreshToken = res.body.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    const loginUser = {
      email: 'g@m.com',
      password: '111111',
    };
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginUser)
      .expect(201);

    expect(loginRes.body.accessToken).toBeDefined();
  });
});
