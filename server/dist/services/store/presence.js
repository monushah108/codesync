"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceStore = void 0;
const PRESENCE_TTL_SECONDS = 86400; // 24 hours
class PresenceStore {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async set(socketId, user) {
        await this.redis
            .pipeline()
            .set(`presence:socket:${socketId}`, JSON.stringify(user), "EX", PRESENCE_TTL_SECONDS)
            .hset(`presence:room:${user.roomId}`, socketId, JSON.stringify(user.user))
            .expire(`presence:room:${user.roomId}`, PRESENCE_TTL_SECONDS)
            .exec();
    }
    async get(socketId) {
        const raw = await this.redis.get(`presence:socket:${socketId}`);
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    async delete(socketId) {
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
    async getRoomMembers(roomId) {
        const data = await this.redis.hvals(`presence:room:${roomId}`);
        const userMap = new Map();
        for (const raw of data) {
            try {
                const user = JSON.parse(raw);
                if (user && user.id) {
                    userMap.set(user.id, user);
                }
            }
            catch (err) {
                console.error("Failed to parse room member:", err);
            }
        }
        return Array.from(userMap.values());
    }
    async getRoomMemberCount(roomId) {
        const members = await this.getRoomMembers(roomId);
        return members.length;
    }
    async has(socketId) {
        const exists = await this.redis.exists(`presence:socket:${socketId}`);
        return exists === 1;
    }
}
exports.PresenceStore = PresenceStore;
//# sourceMappingURL=presence.js.map