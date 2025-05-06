import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql',
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache: cache,
  connectToDevTools: true,
});

export default client;
