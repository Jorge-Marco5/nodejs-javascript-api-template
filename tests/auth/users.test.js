import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '#app';
import { prisma } from '#config/database.js';

describe('User Endpoints', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    const adminRes = await request(app).post('/api/v1/auth/register').send({
      email: 'admin@test.com',
      password: 'admin123',
      name: 'Admin User',
    });

    authToken = adminRes.body.data.token;

    await prisma.user.update({
      where: { email: 'admin@test.com' },
      data: { role: 'ADMIN' },
    });

    const userRes = await request(app).post('/api/v1/auth/register').send({
      email: 'user@test.com',
      password: 'user123',
      name: 'Normal User',
    });

    testUserId = userRes.body.data.user.id;
    const userToken = userRes.body.data.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/v1/users', () => {
    it('debería obtener lista de usuarios (solo admin)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('debería rechazar acceso a usuarios no admin', async () => {
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'user@test.com',
        password: 'user123',
      });
      const normalUserToken = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${normalUserToken}`);

      expect(res.status).toBe(403);
    });
  });
});
