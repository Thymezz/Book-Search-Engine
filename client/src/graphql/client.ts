import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Logging GraphQL URI for verification
console.log('GraphQL URI:', import.meta.env.VITE_GRAPHQL_URI);

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || '/graphql',
});

// Set up authentication link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.error('GraphQL Errors:', graphQLErrors);
  }
  if (networkError) {
    console.error('Network Error:', networkError);
  }
});

// // Error handling link
// const errorLink = new ApolloLink((operation, forward) => {
//   return forward(operation).map((response) => {
//     if (response.errors) {
//       console.error('GraphQL Errors:', response.errors);
//     }
//     return response;
//   });
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });
const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

export default client;
