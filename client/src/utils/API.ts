import type { Book } from '../models/Book.js';

const API_URL = import.meta.env.VITE_GRAPHQL_URI || '/graphql';

// Helper function for sending GraphQL requests
const sendGraphQLRequest = async (query: string, variables = {}, token?: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};

// ✅ Get logged-in user data
export const getMe = async (token: string) => {
  const query = `
    query {
      me {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  `;
  return await sendGraphQLRequest(query, {}, token);
};

// ✅ Create a new user
export const createUser = async (userData: { username: string; email: string; password: string }) => {
  const query = `
    mutation AddUser($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        token
        user {
          _id
          username
          email
        }
      }
    }
  `;
  return await sendGraphQLRequest(query, userData);
};

// ✅ Login a user
export const loginUser = async (userData: { email: string; password: string }) => {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
          email
        }
      }
    }
  `;
  return await sendGraphQLRequest(query, userData);
};

// ✅ Save a book for the logged-in user
export const saveBook = async (bookData: Book, token: string) => {
  const query = `
    mutation SaveBook($bookData: BookInput!) {
      saveBook(bookData: $bookData) {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  `;
  return await sendGraphQLRequest(query, { bookData }, token);
};

// ✅ Remove a saved book for the logged-in user
export const deleteBook = async (bookId: string, token: string) => {
  const query = `
    mutation RemoveBook($bookId: ID!) {
      removeBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          image
          link
        }
      }
    }
  `;
  return await sendGraphQLRequest(query, { bookId }, token);
};

// ✅ Search books using Google Books API
export const searchGoogleBooks = async (query: string) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from Google Books API');
    }
    return await response.json();
  } catch (error) {
    console.error('Google Books API Error:', error);
    throw error;
  }
};
