import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { DataSource } from 'typeorm';

describe('user module', () => {
  let app: INestApplication;
  let authService: AuthService;
  let accessToken: string;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
    dataSource = app.get(DataSource);
  });
  beforeEach(async () => {
    const admin = {
      username: 'admin',
      password: '123456',
      email: 'a@a.com',
      role: 'admin',
    };
    ({ accessToken } = await authService.register(admin));
  });

  afterEach(async () => {
    // Close the database connection if it's open
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('find all user', () => {
    it('should return an array of users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  it('should return the user with specific id', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.username).toBe('admin');
  });
});
