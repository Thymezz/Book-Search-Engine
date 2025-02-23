import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api/index.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API routes
router.use('/api', apiRoutes);

// Serve React front-end in production
router.use((_req: Request, res: Response) => {
  const clientBuildPath = path.resolve(__dirname, '../../../dist/client/index.html'); // Adjusted path for production build
  res.sendFile(clientBuildPath);
});

export default router;
