import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
// Routes
import authRoutes from './routes/auth.js';
import attachmentsRoutes from './routes/user_attachments.js';
// import storageRoutes from './routes/storage.js';
// BBS Routes
import postRoutes from './bbs/routes/posts.js';
import categoryRoutes from './bbs/routes/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the generated OpenAPI specification
const openapiSpecification = JSON.parse(
  readFileSync(path.join(__dirname, '../openapi.json'), 'utf-8')
);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Request logging middleware that skips /health endpoint
app.use((req, res, next) => {
  if (req.path !== '/health') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(openapiSpecification, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BBS API Documentation'
  })
);

// Serve OpenAPI specification
app.get('/openapi.json', (req, res) => {
  res.json(openapiSpecification);
});

app.use('/api/auth', authRoutes);
app.use('/api/user_attachments', attachmentsRoutes);
// app.use('/api/storage', storageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});