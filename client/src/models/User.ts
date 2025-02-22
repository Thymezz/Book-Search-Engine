import type { Book } from './Book';
import bcrypt from 'bcrypt';

// Define the User interface
export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];
}

// Define the User class with password hashing functionality
export class UserModel {
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];

  constructor(username: string | null, email: string | null, password: string | null, savedBooks: Book[] = []) {
    this.username = username;
    this.email = email;
    this.password = password ? this.hashPassword(password) : null;
    this.savedBooks = savedBooks;
  }

  // Method to hash the password
  private hashPassword(password: string): string {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  // Method to compare provided password with stored hash
  public async validatePassword(inputPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(inputPassword, this.password);
  }
}
