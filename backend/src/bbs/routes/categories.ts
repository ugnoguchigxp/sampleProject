import express from 'express';
import { PrismaClient } from '@prisma/client';

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 * 
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the category
 *         name:
 *           type: string
 *           description: The name of the category
 *         _count:
 *           type: object
 *           properties:
 *             posts:
 *               type: number
 *               description: Number of posts in this category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the category was last updated
 * 
 *   responses:
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 */

const router: express.Router = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories with post counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', async (req, res) => {
  const prisma = new PrismaClient(); // テストのためにインスタンス生成をここに移動
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;