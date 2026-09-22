import type Redis from "ioredis";
import type { ConnectedUser, User } from "../types.js";

const PRESENCE_TTL_SECONDS = 86400; // 24 hours

export class PresenceStore {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async set(socketId: string, user: ConnectedUser): Promise<void> {
    await this.redis
      .pipeline()
      .set(
        `presence:socket:${socketId}`,
        JSON.stringify(user),
        "EX",
        PRESENCE_TTL_SECONDS,
      )
      .hset(`presence:room:${user.roomId}`, socketId, JSON.stringify(user.user))
      .expire(`presence:room:${user.roomId}`, PRESENCE_TTL_SECONDS)
      .exec();
  }

  async get(socketId: string): Promise<ConnectedUser | null> {
    const raw = await this.redis.get(`presence:socket:${socketId}`);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as ConnectedUser;
    } catch {
      return null;
    }
  }

  async delete(socketId: string): Promise<ConnectedUser | null> {
    const member = await this.get(socketId);
    if (member) {
      await this.redis
        .pipeline()
        .del(`presence:socket:${socketId}`)
        .hdel(`presence:room:${member.roomId}`, socketId)
        .exec();
    }
    return member;
  }

  async getRoomMembers(roomId: string): Promise<User[]> {
    const data = await this.redis.hvals(`presence:room:${roomId}`);
    const userMap = new Map<string, User>();

    for (const raw of data) {
      try {
        const user = JSON.parse(raw) as User;
        if (user && user.id) {
          userMap.set(user.id, user);
        }
      } catch (err) {
        console.error("Failed to parse room member:", err);
      }
    }

    return Array.from(userMap.values());
  }

  async getRoomMemberCount(roomId: string): Promise<number> {
    const members = await this.getRoomMembers(roomId);
    return members.length;
  }

  async has(socketId: string): Promise<boolean> {
    const exists = await this.redis.exists(`presence:socket:${socketId}`);
    return exists === 1;
  }
}
