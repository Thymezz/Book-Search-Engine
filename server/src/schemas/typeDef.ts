import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # User type definition
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book!]!
  }

  # Book type definition
  type Book {
    bookId: String!
    authors: [String!]
    description: String!
    title: String!
    image: String
    link: String
  }

  # Auth type definition for login and registration
  type Auth {
    token: ID!
    user: User
  }

  # Query definitions for fetching user data
  type Query {
    me: User
  }

  # Input type for saving a book
  input BookInput {
    bookId: String!
    authors: [String!]
    description: String!
    title: String!
    image: String
    link: String
  }

  # Mutation definitions for handling user actions
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
