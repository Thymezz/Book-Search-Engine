import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Log the GraphQL URI for debugging
console.log('GraphQL URI:', import.meta.env.VITE_GRAPHQL_URI);

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
