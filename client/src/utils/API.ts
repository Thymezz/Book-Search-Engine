import type { Book } from '../models/Book.js';

// const API_URL = '/graphql';

// Route to get the logged-in user's info using GraphQL
export const getMe = async (token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
    }),
  });

  return response;
};

// Create a new user using GraphQL mutation
const API_URL = '/graphql';

export const createUser = async (userData: { username: string; email: string; password: string }) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: userData,
    }),
  });

  return response;
};


// Login user using GraphQL mutation
export const loginUser = async (userData: { email: string; password: string }) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: userData,
    }),
  });

  return response;
};

// Save book data for a logged-in user
export const saveBook = async (bookData: Book, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { bookData },
    }),
  });

  return response;
};

// Remove saved book data for a logged-in user
export const deleteBook = async (bookId: string, token: string) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
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
      `,
      variables: { bookId },
    }),
  });

  return response;
};

// Make a search request to Google Books API
export const searchGoogleBooks = (query: string) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
