import User from '../models/User.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      try {
        const user = await User.findById(context.user._id);
        if (!user) {
          throw new Error("User not found");
        }
        const token = signToken(user.username, user.email, String(user._id));
        return { user, token };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch user");
      }
    }
  },

  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect password');
      }

      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    },

    addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, String(user._id));
      return { token, user };
    }
  }
};

export default resolvers;
