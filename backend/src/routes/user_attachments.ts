import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from './auth.js';
import crypto from 'crypto';
import { z } from 'zod';

const prisma = new PrismaClient() as any;
const router: express.Router = express.Router();

// Ensure temp directory exists for file uploads
const uploadDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    const decodedFilename = Buffer.from(file.originalname, 'binary').toString('utf8');
    
    if (!req.fileIds) {
      req.fileIds = {};
    }
    const fileId = uuidv4();
    req.fileIds[decodedFilename] = fileId;
    
    const ext = path.extname(decodedFilename);
    cb(null, `${fileId}${ext}`);
  },
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Add supported file types
  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Generate file fingerprint
const generateFingerprint = (file: Express.Multer.File): string => {
  const hash = crypto.createHash('md5');
  hash.update(`${file.originalname}-${file.size}-${Date.now()}`);
  return hash.digest('hex');
};

/**
 * @openapi
 * components:
 *   schemas:
 *     UserAttachment:
 *       type: object
 *       required:
 *         - id
 *         - fileName
 *         - contentType
 *         - fileSize
 *         - uploadedById
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user attachment
 *         title:
 *           type: string
 *           description: UserAttachment title
 *         fileName:
 *           type: string
 *           description: File name
 *         contentType:
 *           type: string
 *           description: Media content type
 *         fileSize:
 *           type: integer
 *           description: File size (bytes)
 *         mediaFingerprint:
 *           type: string
 *           description: File fingerprint
 *         mediaUpdatedAt:
 *           type: string
 *           format: date-time
 *           description: Media update time
 *         note:
 *           type: string
 *           description: Notes or description
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Update timestamp
 *         uploadedById:
 *           type: string
 *           description: ID of the user who uploaded the file
 */

// Validate user attachment creation request
const createUserAttachmentSchema = z.object({
  title: z.string().optional().transform(val => val && val.trim() !== '' ? val : null),
  note: z.string().optional().transform(val => val && val.trim() !== '' ? val : null),
});

/**
 * @openapi
 * /api/user_attachments:
 *   get:
 *     summary: Get all user attachments
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user attachment list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAttachment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const attachments = await prisma.userAttachment.findMany({
      where: {
        uploadedById: req.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const safeAttachments = attachments.map((attachment: any) => ({
      id: attachment.id.toString(),
      title: attachment.title,
      note: attachment.note,
      mediaFileName: attachment.mediaFileName,
      mediaFileSize: attachment.mediaFileSize ? Number(attachment.mediaFileSize) : null,
      mediaContentType: attachment.mediaContentType,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
    }));

    return res.json(safeAttachments);
  } catch (error) {
    console.error('Error fetching user attachments:', error);
    return res.status(500).json({ error: 'Failed to fetch user attachments' });
  }
});

/**
 * @openapi
 * /api/user_attachments/{id}:
 *   get:
 *     summary: Get user attachment details by ID
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user attachment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAttachment'
 *       404:
 *         description: UserAttachment not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attachment = await prisma.userAttachment.findUnique({
      where: { id },
    });
    
    if (!attachment) {
      return res.status(404).json({ error: 'UserAttachment not found' });
    }
    
    // Verify authorization - users can only access their own files
    if (attachment.uploadedById !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Map database fields to frontend expected field names
    const mappedAttachment = {
      id: attachment.id,
      title: attachment.title,
      mediaFileName: attachment.mediaFileName,
      mediaContentType: attachment.mediaContentType,
      mediaFileSize: Number(attachment.mediaFileSize),
      note: attachment.note,
      createdAt: attachment.createdAt.toISOString(),
      updatedAt: attachment.updatedAt.toISOString(),
    };
    
    return res.json(mappedAttachment);
  } catch (error) {
    console.error('Error fetching user attachment:', error);
    return res.status(500).json({ error: 'Failed to fetch user attachment' });
  }
});

/**
 * @openapi
 * /api/user_attachments:
 *   post:
 *     summary: Upload new user attachment
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               title:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: UserAttachments uploaded successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', authenticate, upload.array('media'), async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Validate request data
    let validatedData;
    try {
      validatedData = createUserAttachmentSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.format() });
      }
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    const { title, note } = validatedData;
    
    // Process file uploads
    const dbAttachments = await Promise.all(files.map(async (file) => {
      // Generate file fingerprint
      const fingerprint = generateFingerprint(file);
      
      const decodedFilename = Buffer.from(file.originalname, 'binary').toString('utf8');
      const fileId = (req as any).fileIds?.[decodedFilename] || uuidv4();
      
      // Save to database
      return await prisma.userAttachment.create({
        data: {
          id: fileId,
          title: title,
          mediaFileName: decodedFilename,
          mediaContentType: file.mimetype,
          mediaFileSize: BigInt(file.size),
          mediaFingerprint: fingerprint,
          mediaUpdatedAt: new Date(),
          note: note,
          uploadedById: req.userId!,
        },
      });
    }));
    
    // Map database fields to frontend expected field names (驼峰命名法)
    const uploadedUserAttachments = dbAttachments.map(attachment => ({
      id: attachment.id,
      title: attachment.title,
      mediaFileName: attachment.mediaFileName,
      mediaContentType: attachment.mediaContentType,
      mediaFileSize: Number(attachment.mediaFileSize),
      note: attachment.note,
      createdAt: attachment.createdAt.toISOString(),
      updatedAt: attachment.updatedAt.toISOString(),
    }));
    
    return res.status(201).json(uploadedUserAttachments);
  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error instanceof Error && error.message === 'Unsupported file type') {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    
    return res.status(500).json({ error: 'Failed to upload file' });
  }
});

/**
 * @openapi
 * /api/user_attachments/{id}:
 *   patch:
 *     summary: Update user attachment information
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: UserAttachment updated successfully
 *       404:
 *         description: UserAttachment not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied
 */
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, note } = req.body;
    
    // Check if attachment exists
    const attachment = await prisma.userAttachment.findUnique({
      where: { id },
    });
    
    if (!attachment) {
      return res.status(404).json({ error: 'UserAttachment not found' });
    }
    
    // Check permissions - users can only update their own files
    if (attachment.uploadedById !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update information
    const updatedAttachment = await prisma.userAttachment.update({
      where: { id },
      data: {
        title,
        note,
        updatedAt: new Date(),
      },
    });
    
    // Map database fields to frontend expected field names
    const mappedAttachment = {
      id: updatedAttachment.id,
      title: updatedAttachment.title,
      mediaFileName: updatedAttachment.mediaFileName,
      mediaContentType: updatedAttachment.mediaContentType,
      mediaFileSize: Number(updatedAttachment.mediaFileSize),
      note: updatedAttachment.note,
      createdAt: updatedAttachment.createdAt.toISOString(),
      updatedAt: updatedAttachment.updatedAt.toISOString(),
    };
    
    return res.json(mappedAttachment);
  } catch (error) {
    console.error('Error updating user attachment:', error);
    return res.status(500).json({ error: 'Failed to update user attachment' });
  }
});

/**
 * @openapi
 * /api/user_attachments/{id}:
 *   delete:
 *     summary: Delete user attachment
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: UserAttachment deleted successfully
 *       404:
 *         description: UserAttachment not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user attachment exists
    const attachment = await prisma.userAttachment.findUnique({
      where: { id },
    });
    
    if (!attachment) {
      return res.status(404).json({ error: 'UserAttachment not found' });
    }
    
    // Verify user has permission to delete
    if (attachment.uploadedById !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete database record
    await prisma.userAttachment.delete({
      where: { id },
    });
    
    // Logic to delete the physical file (if needed)
    // Here we use a standardized file path naming convention for easy management
    const filePath = path.join(uploadDir, `${id}${path.extname(attachment.mediaFileName)}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.json({ message: 'UserAttachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting user attachment:', error);
    return res.status(500).json({ error: 'Failed to delete user attachment' });
  }
});

/**
 * @openapi
 * /api/user_attachments/{id}/download:
 *   get:
 *     summary: Download user attachment
 *     tags: [UserAttachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: UserAttachment file stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: UserAttachment not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Access denied
 */
router.get('/:id/download', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Get user attachment information from database
    const attachment = await prisma.userAttachment.findUnique({
      where: { id },
    });
    
    if (!attachment) {
      return res.status(404).json({ error: 'UserAttachment not found' });
    }
    
    // Verify user has permission to download
    if (attachment.uploadedById !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build file path using the attachment ID as filename (matches storage logic)
    const filePath = path.join(uploadDir, `${id}${path.extname(attachment.mediaFileName)}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found at expected path: ${filePath}`);
      
      const files = fs.readdirSync(uploadDir);
      const fileId = id as string;
      const possibleFiles = files.filter(f => f.startsWith(fileId));
      
      if (possibleFiles.length > 0) {
        const matchedFile = possibleFiles[0];
        if (!matchedFile) return res.status(404).json({ error: 'File not found on disk' });
        const actualFilePath = path.join(uploadDir, matchedFile);
        console.log(`Found alternative file: ${actualFilePath}`);
        
        const encodedFilename = encodeURIComponent(attachment.mediaFileName).replace(/['()]/g, escape);
        
        res.setHeader('Content-Disposition', 
          `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
        res.setHeader('Content-Type', attachment.mediaContentType);
        
        const fileStream = fs.createReadStream(actualFilePath);
        fileStream.pipe(res);
        return;
      }
      
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    const encodedFilename = encodeURIComponent(attachment.mediaFileName).replace(/['()]/g, escape);
    
    res.setHeader('Content-Disposition', 
      `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    
    res.setHeader('Content-Type', attachment.mediaContentType);
    
    // Send the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    return undefined; // Satisfy TypeScript's return type checking
  } catch (error) {
    console.error('Error downloading attachment:', error);
    return res.status(500).json({ error: 'Failed to download attachment' });
  }
});

export default router;
