import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from './api/index.js';

// API routes
router.use('/api', apiRoutes);

// ✅ Serve React static files from the correct directory
router.use(express.static(path.join(__dirname, '../../../dist/client')));

// ✅ Serve React app for all other routes
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../dist/client/index.html'));
});

export default router;
