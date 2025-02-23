import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Log the GraphQL URI for debugging
console.log('GraphQL URI:', import.meta.env.VITE_GRAPHQL_URI);

// Create an HTTP link for the GraphQL endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql', // Fallback for development
});

// Set the authorization header if a token exists
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Initialize Apollo Client with auth and HTTP links
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Attach authLink before httpLink
  cache: new InMemoryCache(),
});

export default client;
