import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { prisma, toId } from '../config/prisma.js';
import { env } from '../config/env.js';
import { wrap, HttpError } from '../middleware/errorHandler.js';
import { requireLogin } from '../middleware/auth.js';
import { getIndentFor } from '../services/indentView.js';

// Owner: Rahul. Files attached to an indent (quotation, specification ...). Saved on disk in backend/uploads/.
//   POST /api/attachments                 multipart form: fields indentId + file   (max 10 MB)
//   GET  /api/attachments?indentId=5      the files of one indent
//   GET  /api/attachments/:id/download    downloads one file
// You can only touch the files of an indent you are allowed to open.
const router = Router();
fs.mkdirSync(env.uploadDir, { recursive: true });
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  storage: multer.diskStorage({
    destination: env.uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^\w.\-]/g, '_')),
  }),
});

async function mayOpen(user, indentId) {
  const indent = await getIndentFor(prisma, user, indentId);
  if (!indent) throw new HttpError(404, 'Indent not found');
  if (indent.forbidden) throw new HttpError(403, 'You cannot open this indent.');
}

router.post('/', requireLogin, upload.single('file'), wrap(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Choose a file.');
  await mayOpen(req.user, req.body.indentId);
  const row = await prisma.attachment.create({
    data: { indentId: toId(req.body.indentId), fileName: req.file.originalname, filePath: req.file.filename, sizeBytes: req.file.size, uploadedById: Number(req.user.id) },
  });
  res.status(201).json(row);
}));

router.get('/', requireLogin, wrap(async (req, res) => {
  await mayOpen(req.user, req.query.indentId);
  res.json(await prisma.attachment.findMany({ where: { indentId: toId(req.query.indentId) }, orderBy: { id: 'asc' } }));
}));

router.get('/:id/download', requireLogin, wrap(async (req, res) => {
  const row = await prisma.attachment.findUnique({ where: { id: toId(req.params.id) } });
  if (!row) throw new HttpError(404, 'File not found');
  await mayOpen(req.user, row.indentId);
  res.download(path.resolve(env.uploadDir, row.filePath), row.fileName);
}));

export default router;
