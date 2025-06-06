import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BBS API Documentation',
      version: '1.0.0',
      description: 'API documentation for the BBS (Bulletin Board System) application',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../src/routes/*.ts'),
    path.join(__dirname, '../src/middleware/*.ts'),
    path.join(__dirname, '../src/bbs/routes/*.ts'), // ← 追加
  ],
};

const openapiSpecification = swaggerJsdoc(options);

fs.writeFileSync(
  path.join(__dirname, '../openapi.json'),
  JSON.stringify(openapiSpecification, null, 2)
);

console.log('OpenAPI specification generated at openapi.json');
