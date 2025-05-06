import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { MyContext, buildContext } from './graphql/context';
import logger from './middlewares/logger';

dotenv.config();

export async function configureApp(): Promise<Express> {
  console.log('Configuring Express...');
  const app: Express = express();

  console.log('Configuring Apollo Server...');
  const apolloServer = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
  });
  await apolloServer.start();
  console.log('Apollo Server configured.');

  app.use(cors<cors.CorsRequest>({ origin: '*' }));
  app.use(express.json());

  app.use(logger);
  const graphqlPath = process.env.GRAPHQL_PATH || '/graphql';
  app.use(
    graphqlPath,
    expressMiddleware(apolloServer, {
      context: buildContext,
    })
  );
  console.log(`GraphQL endpoint: ${graphqlPath}`);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: `Route not found` });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error: :', err.stack);
    res.status(500).json({ message: 'Error: ', error: err.message });
  });

  console.log('Express configured.');
  return app;
}
