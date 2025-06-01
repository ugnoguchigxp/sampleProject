import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, AuthRequest } from '../../routes/auth.js';

// リクエストボディの型定義
interface CreatePostBody {
  title: string;
  content: string;
  categoryId?: string;
}

interface CreateCommentBody {
  content: string;
}

interface UpdatePostBody {
  title: string;
  content: string;
}

const router: express.Router = express.Router();
const prisma = new PrismaClient();

/**
 * @openapi
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         authorId:
 *           type: string
 *           description: The ID of the author who created the post
 *         categoryId:
 *           type: string
 *           description: The ID of the category this post belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the post was last updated
 *         author:
 *           $ref: '#/components/schemas/User'
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *     
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *     
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *     
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - postId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         authorId:
 *           type: string
 *           description: The ID of the author who created the comment
 *         postId:
 *           type: string
 *           description: The ID of the post this comment belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was last updated
 *         author:
 *           $ref: '#/components/schemas/User'
 *     
 *   responses:
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *     
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/ValidationError'
 */

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Returns a list of posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 10
 *         description: Number of posts per page (max 10)
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 *                   description: Total number of posts
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  categoryId: z.string()
});

const createCommentSchema = z.object({
  content: z.string().min(1)
});

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Returns a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(10, parseInt(req.query.pageSize as string) || 10);
    const skip = (page - 1) * pageSize;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: pageSize,
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { comments: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count()
    ]);

    return res.json({ posts, total });
  } catch (error: unknown) {
    console.error('Error in GET /:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: The post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get<{ id: string }>('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    return res.json(post);
  } catch (error: unknown) {
    console.error('Error in GET /:id:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * @openapi
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 minLength: 1
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post<{}, {}, CreatePostBody>('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, categoryId } = createPostSchema.parse(req.body);
    const userId = req.userId!;
    
    console.log('Creating post with userId:', userId);
    
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!userExists) {
      return res.status(400).json({ error: `User with ID ${userId} does not exist` });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
        categoryId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.status(201).json(post);
  } catch (error: unknown) {
    console.error('Error in POST /:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * @openapi
 * /api/posts/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: The created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post<{ id: string }, {}, CreateCommentBody>('/:id/comments', authenticate, async (req: AuthRequest & { params: { id: string }, body: CreateCommentBody }, res: Response) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 認証済みユーザーのIDを取得
    const authorId = req.userId;
    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    return res.status(201).json(comment);
  } catch (error: unknown) {
    console.error('Error in POST /:id/comments:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Not authorized to update this post
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put<{ id: string }, {}, UpdatePostBody>('/:id', authenticate, async (req: AuthRequest & { params: { id: string }, body: UpdatePostBody }, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId!;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.json(updatedPost);
  } catch (error: unknown) {
    console.error('Error in PUT /:id:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         description: Not authorized to delete this post
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete<{ id: string }>('/:id', authenticate, async (req: AuthRequest & { params: { id: string } }, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error: unknown) {
    console.error('Error in DELETE /:id:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

export default router;
