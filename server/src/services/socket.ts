import type { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Groq from "groq-sdk";
import Redis from "ioredis";
import { randomUUID } from "node:crypto";

import { PresenceStore } from "./store/presence.js";
import { YjsStore } from "./store/yjStore.js";
import { ChatStore } from "./store/chatstore.js";
import { registerYjsHandlers } from "./handlers/yjs.js";
import { registerExplorerHandlers } from "./handlers/room.js";
import { registerAIHandlers } from "./handlers/aiChat.js";
import { registerActivityHandlers } from "./handlers/activity.js";

class SocketService {
  private readonly _io: Server;
  private readonly serverId = randomUUID();

  private readonly presence: PresenceStore;
  private readonly yjs: YjsStore;
  private readonly chatStore: ChatStore;

  private readonly groq = new Groq({
    apiKey: process.env.AI_API_KEY!,
  });

  private readonly redis: Redis;
  private readonly redisSubscriber: Redis;
  private redisReady = false;
  private redisErrorLogged = false;
  private subscriberReady = false;
  private subscriberErrorLogged = false;

  constructor(io: Server) {
    this._io = io;

    const redisUrl = process.env.REDIS_URL?.trim() || "redis://127.0.0.1:6379";

    const redisOptions = {
      retryStrategy(times: number) {
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: null,
    };

    this.redis = new Redis(redisUrl, redisOptions);
    this.redisSubscriber = this.redis.duplicate();

    // Hook up Socket.IO Redis Adapter for multi-server horizontal scaling
    this._io.adapter(createAdapter(this.redis, this.redisSubscriber));

    // Initialize Redis-backed stores
    this.presence = new PresenceStore(this.redis);
    this.yjs = new YjsStore(this.redis);
    this.chatStore = new ChatStore(this.redis);

    this.redis.on("ready", () => {
      this.redisReady = true;
      console.log(`[Instance ${this.serverId.slice(0, 8)}] Redis connection ready`);

      if (this.redisErrorLogged) {
        console.log("Redis connection restored");
        this.redisErrorLogged = false;
      }
    });

    this.redis.on("error", (error) => {
      this.redisReady = false;

      if (!this.redisErrorLogged) {
        console.error("Redis connection lost:", error);
        this.redisErrorLogged = true;

        this.io.emit("server:error", {
          message: "Server connection lost. Reconnecting...",
        });
      }
    });

    this.redisSubscriber.on("ready", () => {
      this.subscriberReady = true;
      console.log(`[Instance ${this.serverId.slice(0, 8)}] Redis subscriber ready`);

      if (this.subscriberErrorLogged) {
        console.log("Redis subscriber connection restored");
        this.subscriberErrorLogged = false;
      }
    });

    this.redisSubscriber.on("error", (error) => {
      this.subscriberReady = false;

      if (!this.subscriberErrorLogged) {
        console.error("Redis subscriber connection lost:", error);
        this.subscriberErrorLogged = true;
      }
    });

    // Listen for cluster-wide server-side events for Yjs sync across instances
    this._io.on(
      "yjs:remote_update",
      (data: {
        serverId: string;
        roomId: string;
        fileId: string;
        update: number[];
      }) => {
        if (data && data.serverId !== this.serverId) {
          this.yjs.applyRemoteUpdate(data.roomId, data.fileId, data.update);
        }
      },
    );
  }

  public initListeners() {
    this._io.on("connection", (socket: Socket) => {
      console.log(
        `[Instance ${this.serverId.slice(0, 8)}] Client connected:`,
        socket.id,
      );

      registerYjsHandlers(socket, {
        io: this._io,
        yjs: this.yjs,
        serverId: this.serverId,
      });

      registerExplorerHandlers(socket, {
        io: this._io,
        presence: this.presence,
        yjs: this.yjs,
      });

      registerAIHandlers(socket, {
        io: this._io,
        groq: this.groq,
        presence: this.presence,
        yjs: this.yjs,
        chatStore: this.chatStore,
        redis: this.redis,
      });

      registerActivityHandlers(socket);

      socket.on("disconnect", async () => {
        await this.handleDisconnect(socket);
      });
    });
  }

  private async handleDisconnect(socket: Socket) {
    try {
      const member = await this.presence.get(socket.id);
      if (!member) {
        return;
      }

      await this.presence.delete(socket.id);

      const members = await this.presence.getRoomMembers(member.roomId);

      if (members.length === 0) {
        await this.yjs.deleteRoomDocs(member.roomId);
        await this.chatStore.deleteHistory(member.roomId);
      }

      this._io.to(member.roomId).emit("members", members);

      this._io.to(member.roomId).emit("activity", {
        id: randomUUID(),
        userId: member.user.id,
        userName: member.user.name,
        type: "leave",
        message: `${member.user.name} left the room`,
        time: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error("Error handling disconnect:", err);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.redisSubscriber.quit();
      await this.redis.quit();
    } catch (err) {
      console.error("Error closing Redis connections:", err);
    }
  }

  public get io() {
    return this._io;
  }
}

export default SocketService;
