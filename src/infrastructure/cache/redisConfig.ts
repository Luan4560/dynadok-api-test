import { promisify } from 'util';
import { Redis } from 'ioredis';

// Redis configuration

const redisClient = new Redis();

// Handle Redis connection events
redisClient.on('error', err => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

function getRedis(value: string) {
  const syncRedisGet = promisify(redisClient.get).bind(redisClient);
  return syncRedisGet(value);
}

function setRedis(key: string, value: string) {
  const syncRedisSet = promisify(redisClient.set).bind(redisClient);
  return syncRedisSet(key, value);
}

export { redisClient, getRedis, setRedis };
