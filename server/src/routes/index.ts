import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from './api/index.js';

router.use('/api', apiRoutes);

// Serve React static files in production
router.use(express.static(path.join(__dirname, '../../../client/dist')));

// Serve React app for all other routes
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

export default router;
