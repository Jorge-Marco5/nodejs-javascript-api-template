import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '#app';
import { prisma } from '#config/database.js';

describe('Auth Endpoints', () => {
  let authToken;
  let refreshToken;
  let testUserId;

  beforeAll(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/auth/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');

      authToken = res.body.data.token;
      testUserId = res.body.data.user.id;
    });

    it('debería rechazar email duplicado', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User 2',
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('debería validar formato de email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('debería iniciar sesión con credenciales válidas y generar tokens', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data).toHaveProperty('refreshToken');

      authToken = res.body.data.token;
      refreshToken = res.body.data.refreshToken;

      const session = await prisma.session.findFirst({
        where: {
          userId: testUserId,
          refreshToken: refreshToken,
        },
      });
      expect(session).not.toBeNull();
      expect(session).toHaveProperty('userId', testUserId);
      expect(session).toHaveProperty('refreshToken', refreshToken);
    });

    it('debería rechazar credenciales inválidas', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/profile', () => {
    it('debería obtener perfil con token válido', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).toHaveProperty('id', testUserId);
    });

    it('debería rechazar sin token', async () => {
      const res = await request(app).get('/api/v1/auth/profile');

      expect(res.status).toBe(401);
    });

    it('debería rechazar token inválido', async () => {
      const res = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
