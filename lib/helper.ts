import redis from "./redis";

export async function getCache(key: string) {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error("Redis GET error:", error);
    return null;
  }
}

export async function setCache(key: string, data: unknown, ttl = 60) {
  try {
    return await redis.set(key, data, {
      ex: ttl,
    });
  } catch (error) {
    const err = `Redis SET error: ${error}`;
    return err;
  }
}

export async function deleteCache(key: string) {
  try {
    return await redis.del(key);
  } catch (error) {
    const err = `Redis DEL error: ${error}`;
    return err;
  }
}
