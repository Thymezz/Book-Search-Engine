import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError } from 'apollo-server-express';
import type { JwtPayload } from '../services/auth.js';

const resolvers = {
  Query: {
    // Fetch current authenticated user data
    me: async (_: any, __: any, context: { user: JwtPayload | null }) => {
      if (context.user) {
        const user = await User.findById(context.user._id).select('-__v -password');
        if (!user) {
          throw new AuthenticationError('User not found');
        }
        return user;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // User login
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Register a new user
    addUser: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    // Save a book to the authenticated user's profile
    saveBook: async (_: any, { bookData }: any, context: { user: JwtPayload | null }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } }, // Prevents duplicates
          { new: true, runValidators: true }
        ).select('-__v -password');
        if (!updatedUser) {
          throw new Error('Failed to update user book list');
        }
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    // Remove a book from the user's saved books list
    removeBook: async (_: any, { bookId }: { bookId: string }, context: { user: JwtPayload | null }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).select('-__v -password');
        if (!updatedUser) {
          throw new Error('Failed to remove the book from saved list');
        }
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;
