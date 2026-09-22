"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatStore = void 0;
const node_crypto_1 = require("node:crypto");
class ChatStore {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async getHistory(roomId) {
        const raw = await this.redis.lrange(`chat:history:${roomId}`, 0, -1);
        const messages = [];
        for (const item of raw) {
            try {
                messages.push(JSON.parse(item));
            }
            catch (err) {
                console.error("Failed to parse chat message:", err);
            }
        }
        return messages;
    }
    async setHistory(roomId, content, role, userId, userName) {
        const message = role === "user"
            ? {
                id: (0, node_crypto_1.randomUUID)(),
                content,
                role: "user",
                userId: userId,
                userName: userName,
                createdAt: Date.now(),
            }
            : {
                id: (0, node_crypto_1.randomUUID)(),
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
    async deleteHistory(roomId) {
        await this.redis.del(`chat:history:${roomId}`);
    }
    async deleteAllHistory() {
        const keys = await this.redis.keys("chat:history:*");
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }
}
exports.ChatStore = ChatStore;
//# sourceMappingURL=chatstore.js.map