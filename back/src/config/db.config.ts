import { ENV } from './environments';

export const DB_CONFIG = {
  HOST: ENV.DB_HOST,
  USER: ENV.DB_USER,
  PASSWORD: ENV.DB_PASSWORD,
  DB: ENV.DB_NAME,
  PORT: parseInt(ENV.DB_PORT, 10),
  dialect: 'mysql' as const,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const { HOST, USER, PASSWORD, DB, PORT, dialect, pool } = DB_CONFIG;
