import { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// ✅ Define AuthenticatedRequest interface for user context
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

// ✅ Get a single user by ID or username
export const getSingleUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = signToken(user.username, user.email, String(user._id));
    return res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  return; // ✅ Ensures that all code paths return a value
};

// ✅ Create a user, sign a token, and send it back
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: 'Something went wrong!' });
    }

    const token = signToken(user.username, user.email, String(user._id));
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'User creation failed' });
  }
};

// ✅ Login a user, sign a token, and send it back
export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });

    if (!user) {
      return res.status(400).json({ message: "User not found with provided credentials" });
    }

    const correctPw = await user.isCorrectPassword(req.body.password);

    if (!correctPw) {
      return res.status(400).json({ message: 'Incorrect password!' });
    }

    const token = signToken(user.username, user.email, String(user._id));
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ Save a book to a user's savedBooks list
export const saveBook = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access - User not authenticated.' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id }, // Safely access user ID after null check
      { $addToSet: { savedBooks: req.body } }, // Avoid duplicates
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to save book' });
  }
};

// ✅ Delete a book from a user's savedBooks list
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access - User not authenticated.' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id }, // Safely access user ID after null check
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete book' });
  }
};
