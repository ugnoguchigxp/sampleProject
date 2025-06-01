import { jest, describe, it, beforeAll, beforeEach, expect } from '@jest/globals';
import request from 'supertest';
import express, { Express } from 'express';
import postsRouter from '../../src/bbs/routes/posts.js';
// Prismaのモック
jest.mock('@prisma/client', () => {
  const mPrisma = {
    post: {
      // @ts-expect-error
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'post1',
          title: 'Test Post',
          content: 'Test Content',
          author: { id: 'user1', username: 'user1' },
          category: { id: 'cat1', name: 'Category 1' },
          _count: { comments: 1 },
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        },
      ]),
      // @ts-expect-error
      count: jest.fn().mockResolvedValue(1),
      // @ts-expect-error
      findUnique: jest.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'post1') {
          return Promise.resolve({
            id: 'post1',
            title: 'Test Post',
            content: 'Test Content',
            author: { id: 'user1', username: 'user1' },
            category: { id: 'cat1', name: 'Category 1' },
            comments: [],
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-02T00:00:00Z'),
            authorId: 'user1',
          });
        }
        return Promise.resolve(null);
      }),
      // @ts-expect-error
      create: jest.fn().mockResolvedValue({
        id: 'post2',
        title: 'New Post',
        content: 'New Content',
        author: { id: 'user1', username: 'user1' },
        category: { id: 'cat1', name: 'Category 1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      // @ts-expect-error
      update: jest.fn().mockResolvedValue({
        id: 'post1',
        title: 'Updated Title',
        content: 'Updated Content',
        author: { id: 'user1', username: 'user1' },
        category: { id: 'cat1', name: 'Category 1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      // @ts-expect-error
      delete: jest.fn().mockResolvedValue({}),
    },
    comment: {
      // @ts-expect-error
      create: jest.fn().mockResolvedValue({
        id: 'comment1',
        content: 'Test Comment',
        author: { id: 'user1', username: 'user1' },
        postId: 'post1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    user: {
      // @ts-expect-error
      findUnique: jest.fn().mockResolvedValue({ id: 'user1', username: 'user1' }),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});
describe('Posts API', () => {
  let app: Express;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/posts', postsRouter);
  });
  it('GET /api/posts should return posts and total', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('posts');
    expect(res.body).toHaveProperty('total', 1);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });
  it('GET /api/posts/:id should return a post', async () => {
    const res = await request(app).get('/api/posts/post1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 'post1');
  });
  it('GET /api/posts/:id should return 404 if not found', async () => {
    const { PrismaClient } = require('@prisma/client');
    PrismaClient.mockImplementationOnce(() => ({
      post: {
        // @ts-expect-error
        findUnique: jest.fn().mockResolvedValue(null),
      },
    }));
    app = express();
    app.use(express.json());
    app.use('/api/posts', postsRouter);
    const res = await request(app).get('/api/posts/notfound');
    expect(res.status).toBe(404);
  });
  // POST, PUT, DELETE, コメント追加などのテストも同様に追加可能
});
