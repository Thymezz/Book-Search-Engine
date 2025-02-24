import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import type { Request, Response } from 'express';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Corrected client build path (move up one level from server/dist)
const clientBuildPath = path.resolve(__dirname, '../client');

// Serve static files from the React build
router.use(express.static(clientBuildPath));

// ✅ Serve the React app for all unmatched routes
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default router;
