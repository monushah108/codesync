"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_adapter_1 = require("@socket.io/redis-adapter");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const ioredis_1 = __importDefault(require("ioredis"));
const node_crypto_1 = require("node:crypto");
const presence_js_1 = require("./store/presence.js");
const yjStore_js_1 = require("./store/yjStore.js");
const chatstore_js_1 = require("./store/chatstore.js");
const yjs_js_1 = require("./handlers/yjs.js");
const room_js_1 = require("./handlers/room.js");
const aiChat_js_1 = require("./handlers/aiChat.js");
const activity_js_1 = require("./handlers/activity.js");
class SocketService {
    _io;
    serverId = (0, node_crypto_1.randomUUID)();
    presence;
    yjs;
    chatStore;
    groq = new groq_sdk_1.default({
        apiKey: process.env.AI_API_KEY,
    });
    redis;
    redisSubscriber;
    redisReady = false;
    redisErrorLogged = false;
    subscriberReady = false;
    subscriberErrorLogged = false;
    constructor(io) {
        this._io = io;
        const redisUrl = process.env.REDIS_URL?.trim() || "redis://127.0.0.1:6379";
        const redisOptions = {
            retryStrategy(times) {
                return Math.min(times * 100, 3000);
            },
            maxRetriesPerRequest: null,
        };
        this.redis = new ioredis_1.default(redisUrl, redisOptions);
        this.redisSubscriber = this.redis.duplicate();
        // Hook up Socket.IO Redis Adapter for multi-server horizontal scaling
        this._io.adapter((0, redis_adapter_1.createAdapter)(this.redis, this.redisSubscriber));
        // Initialize Redis-backed stores
        this.presence = new presence_js_1.PresenceStore(this.redis);
        this.yjs = new yjStore_js_1.YjsStore(this.redis);
        this.chatStore = new chatstore_js_1.ChatStore(this.redis);
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
        this._io.on("yjs:remote_update", (data) => {
            if (data && data.serverId !== this.serverId) {
                this.yjs.applyRemoteUpdate(data.roomId, data.fileId, data.update);
            }
        });
    }
    initListeners() {
        this._io.on("connection", (socket) => {
            console.log(`[Instance ${this.serverId.slice(0, 8)}] Client connected:`, socket.id);
            (0, yjs_js_1.registerYjsHandlers)(socket, {
                io: this._io,
                yjs: this.yjs,
                serverId: this.serverId,
            });
            (0, room_js_1.registerExplorerHandlers)(socket, {
                io: this._io,
                presence: this.presence,
                yjs: this.yjs,
            });
            (0, aiChat_js_1.registerAIHandlers)(socket, {
                io: this._io,
                groq: this.groq,
                presence: this.presence,
                yjs: this.yjs,
                chatStore: this.chatStore,
                redis: this.redis,
            });
            (0, activity_js_1.registerActivityHandlers)(socket);
            socket.on("disconnect", async () => {
                await this.handleDisconnect(socket);
            });
        });
    }
    async handleDisconnect(socket) {
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
                id: (0, node_crypto_1.randomUUID)(),
                userId: member.user.id,
                userName: member.user.name,
                type: "leave",
                message: `${member.user.name} left the room`,
                time: new Date().toLocaleTimeString(),
            });
        }
        catch (err) {
            console.error("Error handling disconnect:", err);
        }
    }
    async close() {
        try {
            await this.redisSubscriber.quit();
            await this.redis.quit();
        }
        catch (err) {
            console.error("Error closing Redis connections:", err);
        }
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
//# sourceMappingURL=socket.js.map