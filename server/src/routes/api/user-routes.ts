import express from 'express';
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from '../../controllers/user-controller.js';

// Import authentication middleware
import { authMiddleware } from '../../services/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', createUser);

// User login
router.post('/login', login);

// Get single user details (authenticated)
router.get('/me', authMiddleware, getSingleUser);

// Save a book to user's savedBooks list (authenticated)
router.put('/save', authMiddleware, saveBook);

// Delete a book from user's savedBooks list (authenticated)
router.delete('/books/:bookId', authMiddleware, deleteBook);

export default router;
