import http from 'http';
import db from './models';
import { configureApp } from './server';
import { ENV } from './config/environments';
import { connectRedis } from './lib/redis';

const PORT: number = parseInt(ENV.PORT, 10);

async function main() {
  try {
    console.log('Trying to connect to the database...');
    await db.sequelize.authenticate();
    console.log('DB connection established successfully.');

    const app = await configureApp();

    await connectRedis();

    const httpServer = http.createServer(app);

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: PORT }, resolve)
    );
    console.log(`Server ready at http://localhost:${PORT}${ENV.GRAPHQL_PATH}`);
    console.log(`Environment: ${ENV.NODE_ENV}`);
  } catch (error) {
    console.error('Init failed: ', error);
    process.exit(1);
  }
}

main();
