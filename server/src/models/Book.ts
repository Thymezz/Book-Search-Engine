import { Schema, type Document } from 'mongoose';

// Define BookDocument interface for TypeScript
export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// Define book schema
const bookSchema = new Schema<BookDocument>(
  {
    authors: [
      {
        type: String,
        required: true, // Ensures at least one author is provided
      },
    ],
    description: {
      type: String,
      required: true, // Description is mandatory
    },
    // Saved book ID from GoogleBooks
    bookId: {
      type: String,
      required: true, // Book ID is mandatory
      unique: true, // Prevent duplicate book IDs in user's saved list
    },
    image: {
      type: String,
    },
    link: {
      type: String,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid URL!`,
      },
    },
    title: {
      type: String,
      required: true, // Title is required
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default bookSchema;
