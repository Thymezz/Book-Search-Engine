import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || '';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

// 🔒 Middleware to authenticate requests
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // Extract token from Bearer string
  if (req.headers.authorization) {
    token = token.split(' ').pop()?.trim();
  }

  if (!token) {
    return next(); // Continue without user if no token is provided
  }

  try {
    // Verify token and attach user data to request
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = {
      _id: decoded._id,
      username: decoded.username,
    };
  } catch (err) {
    console.log('Invalid token:', err);
  }

  return next();
};

// 🔑 Function to sign JWT tokens
export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
