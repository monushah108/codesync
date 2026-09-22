import * as Y from "yjs";
import type Redis from "ioredis";

export class YjsStore {
  private docs = new Map<string, Y.Doc>();
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async getDoc(roomId: string, fileId: string): Promise<Y.Doc> {
    const key = `${roomId}:${fileId}`;

    let doc = this.docs.get(key);

    if (!doc) {
      doc = new Y.Doc();
      this.docs.set(key, doc);

      try {
        const raw = await this.redis.get(`yjs:doc:${key}`);
        if (raw) {
          const update = Buffer.from(raw, "base64");
          Y.applyUpdate(doc, update);
        }
      } catch (err) {
        console.error(`Failed to load Yjs doc from Redis for ${key}:`, err);
      }
    }

    return doc;
  }

  getDocSync(roomId: string, fileId: string): Y.Doc {
    const key = `${roomId}:${fileId}`;
    let doc = this.docs.get(key);
    if (!doc) {
      doc = new Y.Doc();
      this.docs.set(key, doc);
    }
    return doc;
  }

  async persistDoc(roomId: string, fileId: string): Promise<void> {
    const key = `${roomId}:${fileId}`;
    const doc = this.docs.get(key);
    if (!doc) return;

    try {
      const update = Y.encodeStateAsUpdate(doc);
      const base64 = Buffer.from(update).toString("base64");
      await this.redis.set(`yjs:doc:${key}`, base64, "EX", 86400);
    } catch (err) {
      console.error(`Failed to persist Yjs doc to Redis for ${key}:`, err);
    }
  }

  applyRemoteUpdate(
    roomId: string,
    fileId: string,
    update: Uint8Array | number[],
  ): void {
    const key = `${roomId}:${fileId}`;
    let doc = this.docs.get(key);

    if (!doc) {
      doc = new Y.Doc();
      this.docs.set(key, doc);
    }

    const binaryUpdate =
      update instanceof Uint8Array ? update : new Uint8Array(update);
    Y.applyUpdate(doc, binaryUpdate);
  }

  async deleteDoc(roomId: string, fileId: string): Promise<void> {
    const key = `${roomId}:${fileId}`;

    const doc = this.docs.get(key);
    if (doc) {
      doc.destroy();
      this.docs.delete(key);
    }

    try {
      await this.redis.del(`yjs:doc:${key}`);
    } catch (err) {
      console.error(`Failed to delete Yjs doc from Redis for ${key}:`, err);
    }
  }

  async deleteRoomDocs(roomId: string): Promise<void> {
    for (const [key, doc] of this.docs) {
      if (key.startsWith(`${roomId}:`)) {
        doc.destroy();
        this.docs.delete(key);
      }
    }

    try {
      const keys = await this.redis.keys(`yjs:doc:${roomId}:*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err) {
      console.error(`Failed to delete room docs from Redis for ${roomId}:`, err);
    }
  }
}
