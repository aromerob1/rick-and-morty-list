import { createClient } from 'redis';
import { ENV } from '../config/environments';

export type RedisClientType = ReturnType<typeof createClient>;
export let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  console.log(`Trying to connect to Redis...`);

  redisClient = createClient({
    url: ENV.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  redisClient.on('connect', () => console.log('Connected to Redis'));

  redisClient.on('reconnecting', () => console.log('Reconnecting to Redis...'));

  redisClient.on('end', () => console.log('Disconnected from Redis'));

  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Cannot connect to redis: ', err);
    process.exit(1);
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient?.isOpen) {
    console.log('Disconnecting from Redis...');
    await redisClient.quit();
  }
};
