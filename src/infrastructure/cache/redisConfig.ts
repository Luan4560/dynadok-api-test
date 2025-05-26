import { promisify } from 'util';
import { Redis } from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', err => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

redisClient.on('ready', () => {
  console.log('Redis Client Ready');
});

async function getRedis(value: string) {
  try {
    const syncRedisGet = promisify(redisClient.get).bind(redisClient);
    return await syncRedisGet(value);
  } catch (error) {
    console.error('Error getting value from Redis:', error);
    return null;
  }
}

async function setRedis(key: string, value: string, expireTime?: number) {
  try {
    if (expireTime) {
      await redisClient.setex(key, expireTime, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    console.error('Error setting value in Redis:', error);
  }
}

async function deleteRedis(key: string) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Error deleting value from Redis:', error);
  }
}

export { redisClient, getRedis, setRedis, deleteRedis };
