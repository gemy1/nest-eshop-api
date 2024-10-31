import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';

describe('Auth module', () => {
  let app: INestApplication;
  let authService: AuthService;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
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
