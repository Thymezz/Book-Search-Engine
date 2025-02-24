import type { Request, Response } from 'express';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from './api/index.js';

// ✅ Serve API routes
router.use('/api', apiRoutes);

// ✅ Correctly serve built client files
const clientPath = path.resolve(__dirname, '../../client');
router.use(express.static(clientPath));

// ✅ Serve React app for all other routes
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

export default router;
