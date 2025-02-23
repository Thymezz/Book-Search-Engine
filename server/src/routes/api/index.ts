import express from 'express';
import userRoutes from './user-routes.js'; // Import user routes

const router = express.Router();

// Attach user routes
router.use('/users', userRoutes);

// Health check route
router.get('/health', (_req, res) => {
  res.json({ status: 'API is working!' });
});

export default router;
