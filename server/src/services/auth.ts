import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || '';

export interface JwtPayload {
  _id: string; // Explicitly use string type
  username: string;
  email: string;
}

// ✅ Export the middleware correctly
export const authMiddleware = (req: any, _: any, next: any) => { 
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return next();
  }

  try {
    const { _id, username, email } = jwt.verify(token, secretKey) as JwtPayload;
    req.user = { _id, username, email };
  } catch (err) {
    console.log('Invalid token', err);
  }

  return next();
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
