import { BaseContext } from '@apollo/server';
import { RedisClientType, redisClient } from '../lib/redis';

export interface MyContext extends BaseContext {
  redis: RedisClientType;
}

export const buildContext = async ({}): Promise<MyContext> => {
  if (!redisClient?.isOpen) {
    console.error('Redis client is not open');
    throw new Error('Internal Server Error: Cache service unavailable');
  }
  return {
    redis: redisClient,
  };
};
