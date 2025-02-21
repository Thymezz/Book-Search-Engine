// src/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
      }
    }
  }
`;
