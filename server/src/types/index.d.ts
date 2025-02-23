// Extend Express Request type to include user data
declare namespace Express {
  interface Request {
    user?: {
      _id: unknown;
      username: string;
      email: string;
    };
  }
}
