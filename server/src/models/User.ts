import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import bookSchema, { BookDocument } from './Book.js'; // ✅ Import BookDocument for TypeScript type checking

// Interface for User Document
export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

// Define user schema
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Embedded savedBooks array using BookSchema
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true, // Include virtuals in the JSON output
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare and validate password for login
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Virtual to count saved books
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Export the User model
const User = model<UserDocument>('User', userSchema);
export default User;
