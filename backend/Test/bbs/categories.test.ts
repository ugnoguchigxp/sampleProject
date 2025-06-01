import { jest, describe, it, beforeAll, beforeEach, expect } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import categoriesRouter from '../../src/bbs/routes/categories.js';
jest.mock('@prisma/client', () => {
  const mPrisma = {
    category: {
      findMany: jest.fn<() => Promise<Array<{ id: string; name: string; _count: { posts: number }; createdAt: Date; updatedAt: Date }>>>().mockResolvedValue([
        {
          id: 'cat1',
          name: 'Category 1',
          _count: { posts: 2 },
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        },
        {
          id: 'cat2',
          name: 'Category 2',
          _count: { posts: 0 },
          createdAt: new Date('2024-01-03T00:00:00Z'),
          updatedAt: new Date('2024-01-04T00:00:00Z'),
        },
      ] as Array<{ id: string; name: string; _count: { posts: number }; createdAt: Date; updatedAt: Date }>),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});
describe('GET /api/categories', () => {
  let app: Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/categories', categoriesRouter);
  });
  it('should return a list of categories with post counts', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toMatchObject({
      id: 'cat1',
      name: 'Category 1',
      _count: { posts: 2 },
    });
  });
  it('should handle internal server error', async () => {
    // PrismaのfindManyをエラーにする
    const { PrismaClient } = require('@prisma/client');
    PrismaClient.mockImplementationOnce(() => ({
      category: {
        findMany: jest.fn<() => Promise<never>>().mockRejectedValue(new Error('DB error')),
      },
    }));
    app = express();
    app.use(express.json());
    app.use('/api/categories', categoriesRouter);
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
