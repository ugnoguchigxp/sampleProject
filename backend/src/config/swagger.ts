import swaggerJsdoc from 'swagger-jsdoc';

// Hardcode version for now to avoid import issues
const version = '1.0.0';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SampleProject API Documentation',
      version: version,
      description: 'API documentation for the SampleProject application',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'http://api.yourdomain.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the post'
            },
            title: {
              type: 'string',
              description: 'The title of the post',
              minLength: 1,
              maxLength: 200
            },
            content: {
              type: 'string',
              description: 'The content of the post',
              minLength: 1
            },
            authorId: {
              type: 'string',
              description: 'The ID of the author who created the post'
            },
            categoryId: {
              type: 'string',
              description: 'The ID of the category this post belongs to'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the post was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the post was last updated'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['content', 'postId'],
          properties: {
            id: {
              type: 'string',
              description: 'The auto-generated id of the comment'
            },
            content: {
              type: 'string',
              description: 'The content of the comment',
              minLength: 1
            },
            authorId: {
              type: 'string',
              description: 'The ID of the author who created the comment'
            },
            postId: {
              type: 'string',
              description: 'The ID of the post this comment belongs to'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the comment was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the comment was last updated'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/middleware/*.ts'
  ]
};

export const specs = swaggerJsdoc(options);
