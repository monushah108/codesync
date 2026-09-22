import redis from "./redis";

export const CacheKeys = {
  userRooms: (userId: string) => `user:${userId}:rooms`,
  roomUser: (roomId: string, userId: string) => `room:${roomId}:user:${userId}`,
  roomDirectory: (roomId: string, parentId?: string | null) =>
    `room:${roomId}:parent:${parentId || "root"}`,
  roomFiles: (roomId: string) => `room:${roomId}:files`,
  file: (fileId: string) => `file:${fileId}`,
  roomMembersUser: (roomId: string, userId: string) =>
    `room:${roomId}:members:user:${userId}`,
  member: (memberId: string) => `member:${memberId}`,
};

export async function getCache<T = unknown>(key: string): Promise<T | null> {
  try {
    return (await redis.get(key)) as T | null;
  } catch (error) {
    console.error(`Redis GET error for key [${key}]:`, error);
    return null;
  }
}

export async function setCache(key: string, data: unknown, ttl = 60) {
  try {
    return await redis.set(key, data, {
      ex: ttl,
    });
  } catch (error) {
    console.error(`Redis SET error for key [${key}]:`, error);
    return null;
  }
}

export async function deleteCache(...keys: (string | undefined | null)[]) {
  try {
    const validKeys = keys.filter(
      (k): k is string => typeof k === "string" && k.length > 0,
    );
    if (validKeys.length === 0) return 0;
    return await redis.del(...validKeys);
  } catch (error) {
    console.error("Redis DEL error:", error);
    return null;
  }
}

export async function deleteCachePattern(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys && keys.length > 0) {
      return await redis.del(...keys);
    }
    return 0;
  } catch (error) {
    console.error(`Redis DEL pattern error for [${pattern}]:`, error);
    return null;
  }
}
