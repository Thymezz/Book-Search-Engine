import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

// Now access the environment variables
const secretKey = process.env.JWT_SECRET_KEY || '';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authMiddleware = ({ req }: { req: any }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { _id, username, email } = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { _id, username, email };
  } catch (err) {
    console.log('Invalid token', err);
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  console.log("Signing token with payload:", payload);
  console.log("Using secret key:", secretKey);

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
