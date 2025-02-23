import type { Request, Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import type { UserDocument } from '../models/User.js';

// Custom interface to extend Request object with user
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    username: string;
  };
}

// ✅ Get a single user by ID or username
export const getSingleUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const foundUser = await User.findOne({
      $or: [{ _id: req.user?._id || req.params.id }, { username: req.params.username }],
    });

    if (!foundUser) {
      return res.status(400).json({ message: 'Cannot find a user with this ID or username!' });
    }

    return res.json(foundUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create a user, sign a token, and send it back
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({ message: 'Something went wrong!' });
    }

    const token = signToken(user.username, user.email, user._id);
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

    const token = signToken(user.username, user.email, user._id);
    return res.json({ token, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// ✅ Save a book to a user's `savedBooks` field
export const saveBook = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { savedBooks: req.body } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Failed to save book' });
  }
};

// ✅ Remove a book from `savedBooks`
export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { savedBooks: { bookId: req.params.bookId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found with provided ID" });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to remove book' });
  }
};
