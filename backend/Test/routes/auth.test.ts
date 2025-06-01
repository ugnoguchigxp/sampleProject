import { jest, describe, it, beforeAll, beforeEach, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRouter, { hashPassword } from '../../src/routes/auth.js';

// Prisma, bcrypt, jwtのモック
jest.mock('@prisma/client', () => {
  const mPrisma = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});
jest.mock('bcryptjs', () => ({
  // @ts-expect-error
  hash: jest.fn().mockResolvedValue('hashedpw'),
  // @ts-expect-error
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('testtoken'),
  verify: jest.fn().mockReturnValue({ userId: 'user1', email: 'test@example.com', username: 'testuser' }),
}));

describe('Auth API', () => {
  let app: express.Express;
  let prisma: any;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/register success', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'user1', email: 'test@example.com', username: 'testuser' });
    const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com', username: 'testuser', password: 'password' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token', 'testtoken');
    expect(res.body.user).toMatchObject({ id: 'user1', email: 'test@example.com', username: 'testuser' });
  });

  it('POST /api/auth/register duplicate', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'user1' });
    const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com', username: 'testuser', password: 'password' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/login success', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user1', email: 'test@example.com', username: 'testuser', password: 'hashedpw' });
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'testtoken');
    expect(res.body.user).toMatchObject({ id: 'user1', email: 'test@example.com', username: 'testuser' });
  });

  it('POST /api/auth/login invalid user', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({ email: 'notfound@example.com', password: 'password' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/login invalid password', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user1', email: 'test@example.com', username: 'testuser', password: 'hashedpw' });
    const bcrypt = require('bcryptjs');
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'wrongpw' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/auth/test success', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: 'user1', email: 'test@example.com', username: 'testuser' }]);
    const res = await request(app).get('/api/auth/test').set('Authorization', 'Bearer testtoken');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('userId', 'user1');
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it('GET /api/auth/test unauthorized', async () => {
    const res = await request(app).get('/api/auth/test');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
