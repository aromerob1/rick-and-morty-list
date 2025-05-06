import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'database_name_dev',
  GRAPHQL_PATH: process.env.GRAPHQL_PATH || '/graphql',
  RICKMORTY_API_BASE_URL:
    process.env.RICKMORTY_API_BASE_URL || 'https://rickandmortyapi.com/api',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
