import { randomUUID } from "node:crypto";
import type Redis from "ioredis";

export type ChatMessage =
  | {
      id: string;
      content: string;
      role: "user";
      userId: string;
      userName: string;
      createdAt: number;
    }
  | {
      id: string;
      content: string;
      role: "assistant";
      createdAt: number;
    };

export class ChatStore {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getHistory(roomId: string): Promise<ChatMessage[]> {
    const raw = await this.redis.lrange(`chat:history:${roomId}`, 0, -1);
    const messages: ChatMessage[] = [];

    for (const item of raw) {
      try {
        messages.push(JSON.parse(item));
      } catch (err) {
        console.error("Failed to parse chat message:", err);
      }
    }

    return messages;
  }

  async setHistory(
    roomId: string,
    content: string,
    role: "user" | "assistant",
    userId?: string,
    userName?: string,
  ): Promise<ChatMessage> {
    const message: ChatMessage =
      role === "user"
        ? {
            id: randomUUID(),
            content,
            role: "user",
            userId: userId!,
            userName: userName!,
            createdAt: Date.now(),
          }
        : {
            id: randomUUID(),
            content,
            role: "assistant",
            createdAt: Date.now(),
          };

    await this.redis
      .pipeline()
      .rpush(`chat:history:${roomId}`, JSON.stringify(message))
      .ltrim(`chat:history:${roomId}`, -100, -1)
      .expire(`chat:history:${roomId}`, 60 * 60 * 24 * 7)
      .exec();

    return message;
  }

  async deleteHistory(roomId: string): Promise<void> {
    await this.redis.del(`chat:history:${roomId}`);
  }

  async deleteAllHistory(): Promise<void> {
    const keys = await this.redis.keys("chat:history:*");
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
