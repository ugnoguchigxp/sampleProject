// import express, { Response } from 'express';
// import multer from 'multer';
// import { authenticate, AuthRequest } from './auth.js';
// import { activeStorage } from '../services/active-storage-service.js';
// import { createStorageService } from '../services/storage/index.js';
// import { PrismaClient } from '@prisma/client';
// import { z } from 'zod';

// const prisma = new PrismaClient() as any;
// const storageService = createStorageService();

// const router: express.Router = express.Router();

// // Use memory storage for multer to pass buffer to storage service
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
//   fileFilter: (_req, file, cb) => {
//     // 支持的文件类型
//     const allowedMimes = [
//       'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
//       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'text/plain'
//     ];
    
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error(`不支持的文件类型: ${file.mimetype}`));
//     }
//   }
// });

// // 验证附件上传请求
// const uploadRequestSchema = z.object({
//   name: z.string().min(1, "附件名称不能为空"),
//   recordType: z.string().min(1, "记录类型不能为空"),
//   recordId: z.string().min(1, "记录ID不能为空"),
//   metadata: z.string().optional().transform(val => {
//     if (!val) return {};
//     try {
//       return JSON.parse(val);
//     } catch (e) {
//       return {};
//     }
//   }),
// });

// /**
//  * @openapi
//  * /api/storage/upload:
//  *   post:
//  *     summary: Upload a file using Active Storage
//  *     tags: [Storage]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - file
//  *               - name
//  *               - recordType
//  *               - recordId
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *                 description: File to upload
//  *               name:
//  *                 type: string
//  *                 description: Attachment name (e.g. "avatar")
//  *               recordType:
//  *                 type: string
//  *                 description: Type of record being attached to (e.g. "User")
//  *               recordId:
//  *                 type: string
//  *                 description: ID of record being attached to
//  *               metadata:
//  *                 type: string
//  *                 description: JSON string of metadata
//  *     responses:
//  *       201:
//  *         description: File uploaded successfully
//  *       400:
//  *         description: Invalid request
//  *       401:
//  *         $ref: '#/components/responses/UnauthorizedError'
//  */
// router.post('/upload', authenticate, upload.single('file'), async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: '没有上传文件' });
//     }

//     const result = uploadRequestSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({ 
//         error: '请求参数无效', 
//         details: result.error.errors 
//       });
//     }
    
//     const { name, recordType, recordId, metadata } = result.data;

//     // 添加用户ID到元数据 - 这对审计和权限检查很有用
//     const enhancedMetadata = {
//       ...metadata,
//       uploadedBy: req.userId,
//     };

//     // 验证文件类型（如果需要）
//     try {
//       activeStorage.validateFile(req.file, {
//         // 可以传入自定义验证选项
//       });
//     } catch (error) {
//       return res.status(400).json({ error: (error as Error).message });
//     }

//     // 使用Active Storage服务附加文件
//     const attachment = await activeStorage.attachOne({
//       name,
//       record: { type: recordType, id: recordId },
//       file: req.file,
//       metadata: enhancedMetadata,
//     });

//     // 重新格式化响应以处理BigInt
//     const response = {
//       id: attachment.id,
//       name: attachment.name,
//       recordType: attachment.recordType,
//       recordId: attachment.recordId,
//       blob: {
//         id: attachment.blob.id,
//         filename: attachment.blob.filename,
//         contentType: attachment.blob.contentType,
//         byteSize: Number(attachment.blob.byteSize),
//         createdAt: attachment.blob.createdAt,
//       },
//       url: activeStorage.getUrl(attachment),
//       createdAt: attachment.createdAt,
//     };

//     return res.status(201).json(response);
    
//   } catch (error) {
//     console.error('上传文件错误:', error);
//     return res.status(500).json({ error: '上传文件失败' });
//   }
// });

// /**
//  * @openapi
//  * /api/storage/files:
//  *   get:
//  *     summary: Get all files for a specific record
//  *     tags: [Storage]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: name
//  *         in: query
//  *         description: Attachment name
//  *         schema:
//  *           type: string
//  *       - name: recordType
//  *         in: query
//  *         required: true
//  *         description: Type of record
//  *         schema:
//  *           type: string
//  *       - name: recordId
//  *         in: query
//  *         required: true
//  *         description: ID of record
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: List of attachments
//  *       401:
//  *         $ref: '#/components/responses/UnauthorizedError'
//  */
// router.get('/files', authenticate, async (req: AuthRequest, res: Response) => {
//   try {
//     const { name, recordType, recordId } = req.query;

//     if (!recordType || !recordId) {
//       return res.status(400).json({ error: '必须提供recordType和recordId参数' });
//     }

//     let attachments: any[] = [];
    
//     if (name) {
//       // 获取指定名称的单个附件
//       const attachment = await activeStorage.getAttachment({
//         name: name as string,
//         record: { type: recordType as string, id: recordId as string },
//       });
      
//       attachments = attachment ? [attachment] : [];
//     } else {
//       // 获取所有附件
//       attachments = await activeStorage.getAttachments({
//         name: '*', // 获取所有附件的通配符
//         record: { type: recordType as string, id: recordId as string },
//       });
//     }

//     // 处理响应格式，转换BigInt并添加URL
//     const response = attachments.map(attachment => ({
//       id: attachment.id,
//       name: attachment.name,
//       recordType: attachment.recordType,
//       recordId: attachment.recordId,
//       blob: {
//         id: attachment.blob.id,
//         filename: attachment.blob.filename,
//         contentType: attachment.blob.contentType,
//         byteSize: Number(attachment.blob.byteSize),
//         createdAt: attachment.blob.createdAt,
//         metadata: attachment.blob.metadata,
//       },
//       url: activeStorage.getUrl(attachment),
//       createdAt: attachment.createdAt,
//     }));

//     return res.json(response);
    
//   } catch (error) {
//     console.error('获取文件错误:', error);
//     return res.status(500).json({ error: '获取文件失败' });
//   }
// });

// /**
//  * @openapi
//  * /api/storage/{id}:
//  *   get:
//  *     summary: Get attachment by ID
//  *     tags: [Storage]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Attachment details
//  *       401:
//  *         $ref: '#/components/responses/UnauthorizedError'
//  *       404:
//  *         description: Attachment not found
//  */
// router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).json({ error: '无效的附件ID' });
//     }
    
//     const attachment = await activeStorage.getAttachmentById(id);
    
//     if (!attachment) {
//       return res.status(404).json({ error: '附件未找到' });
//     }

//     // 如果存在uploadedBy元数据，检查权限
//     const metadata = attachment.blob.metadata as Record<string, any> || {};
//     if (metadata.uploadedBy && metadata.uploadedBy !== req.userId) {
//       // 你可以在这里实现更细粒度的权限检查
//       // 如果需要，可以允许某些角色访问任何文件
//     }

//     const response = {
//       id: attachment.id,
//       name: attachment.name,
//       recordType: attachment.recordType,
//       recordId: attachment.recordId,
//       blob: {
//         id: attachment.blob.id,
//         filename: attachment.blob.filename,
//         contentType: attachment.blob.contentType,
//         byteSize: Number(attachment.blob.byteSize),
//         createdAt: attachment.blob.createdAt,
//         metadata: attachment.blob.metadata,
//       },
//       url: activeStorage.getUrl(attachment),
//       createdAt: attachment.createdAt,
//     };

//     return res.json(response);
    
//   } catch (error) {
//     console.error('获取文件详情错误:', error);
//     return res.status(500).json({ error: '获取文件详情失败' });
//   }
// });

// /**
//  * @openapi
//  * /api/storage/{id}/download:
//  *   get:
//  *     summary: Download a file
//  *     tags: [Storage]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: File content
//  *         content:
//  *           application/octet-stream:
//  *             schema:
//  *               type: string
//  *               format: binary
//  *       401:
//  *         $ref: '#/components/responses/UnauthorizedError'
//  *       404:
//  *         description: File not found
//  */
// router.get('/:id/download', authenticate, async (req: AuthRequest, res: Response) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).json({ error: '无效的附件ID' });
//     }
    
//     const attachment = await activeStorage.getAttachmentById(id);
    
//     if (!attachment) {
//       return res.status(404).json({ error: '附件未找到' });
//     }
    
//     // 如果存在uploadedBy元数据，检查权限
//     const metadata = attachment.blob.metadata as Record<string, any> || {};
//     if (metadata.uploadedBy && metadata.uploadedBy !== req.userId) {
//       // 你可以在这里实现更细粒度的权限检查
//       // 如果需要，可以允许某些角色访问任何文件
//       // return res.status(403).json({ error: '无权访问此文件' });
//     }
    
//     try {
//       // 获取文件内容
//       const fileContent = await activeStorage.getContent(attachment);
      
//       // 设置适当的响应头，确保国际化字符名称可以正确显示
//       const encodedFilename = encodeURIComponent(attachment.blob.filename).replace(/['()]/g, escape);
      
//       res.setHeader('Content-Disposition', 
//         `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
//       res.setHeader('Content-Type', attachment.blob.contentType);
//       res.setHeader('Content-Length', attachment.blob.byteSize.toString());
      
//       // 发送文件内容
//       res.send(fileContent);
//       return;
      
//     } catch (e) {
//       console.error('获取文件内容错误:', e);
//       return res.status(404).json({ error: '无法读取文件内容' });
//     }
    
//   } catch (error) {
//     console.error('下载文件错误:', error);
//     return res.status(500).json({ error: '下载文件失败' });
//   }
// });

// /**
//  * @openapi
//  * /api/storage/{id}:
//  *   delete:
//  *     summary: Delete an attachment
//  *     tags: [Storage]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Attachment deleted
//  *       401:
//  *         $ref: '#/components/responses/UnauthorizedError'
//  *       404:
//  *         description: Attachment not found
//  */
// router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
//   try {
//     const id = req.params.id;
//     if (!id) {
//       return res.status(400).json({ error: '无效的附件ID' });
//     }
    
//     const attachment = await activeStorage.getAttachmentById(id);
    
//     if (!attachment) {
//       return res.status(404).json({ error: '附件未找到' });
//     }
    
//     // 检查权限 - 确保只有上传者（或管理员）可以删除
//     const metadata = attachment.blob.metadata as Record<string, any> || {};
//     if (metadata.uploadedBy && metadata.uploadedBy !== req.userId) {
//       return res.status(403).json({ error: '无权删除此文件' });
//     }
    
//     // 删除附件（包括从存储中删除文件）
//     await activeStorage.purgeById(id);
    
//     return res.json({ message: '附件已成功删除' });
    
//   } catch (error) {
//     console.error('删除文件错误:', error);
//     return res.status(500).json({ error: '删除文件失败' });
//   }
// });

// /**
//  * 提供直接的blob访问端点
//  * 这个路由应该是公开的，但可能需要token或签名URL进行限制
//  * 这里为了简化，我们允许直接访问
//  */
// router.get('/blob/:key', async (req, res) => {
//   try {
//     const key = req.params.key;
//     if (!key) {
//       return res.status(400).send('Invalid key');
//     }
    
//     // 查找对应的blob
//     const blob = await prisma.StorageBlob.findUnique({
//       where: { key }
//     });
    
//     if (!blob) {
//       return res.status(404).send('File not found');
//     }
    
//     try {
//       // 获取文件内容
//       const fileContent = await storageService.retrieve(key);
      
//       // 设置响应头
//       const encodedFilename = encodeURIComponent(blob.filename).replace(/['()]/g, escape);
      
//       res.setHeader('Content-Disposition', 
//         `inline; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
//       res.setHeader('Content-Type', blob.contentType || 'application/octet-stream');
//       res.setHeader('Content-Length', blob.byteSize.toString());
      
//       // 发送文件内容
//       res.send(fileContent);
//       return;
//     } catch (error) {
//       console.error('获取blob内容错误:', error);
//       return res.status(404).send('File content not available');
//     }
//   } catch (error) {
//     console.error('获取blob错误:', error);
//     return res.status(500).send('Failed to retrieve file');
//   }
// });

// export default router;
