import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Auth module', () => {
  let app: INestApplication;
  const accessToken: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiZ0B2LmNvbSIsInVzZXJuYW1lIjoibmV3IGdhbWFsIiwiaWF0IjoxNzI5MzQ3MzQ4LCJleHAiOjE3Mjk0MzM3NDh9.BwoXkPpenbyMH7rTW6YBe7LgHmXA9h14-GCYu7vteLU';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
});
