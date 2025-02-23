import express, { Response } from 'express';
import { getSingleUser, saveBook, deleteBook } from '../../controllers/user-controller.js';
import { authMiddleware } from '../../services/auth.js';


const router = express.Router();

router.get('/me', authMiddleware, async (req: any, res: Response) => {
  await getSingleUser(req, res);
});

router.put('/save', authMiddleware, async (req: any, res: Response) => {
  await saveBook(req, res);
});

router.delete('/books/:bookId', authMiddleware, async (req: any, res: Response) => {
  await deleteBook(req, res);
});

export default router;
