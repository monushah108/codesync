"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.YjsStore = void 0;
const Y = __importStar(require("yjs"));
class YjsStore {
    docs = new Map();
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async getDoc(roomId, fileId) {
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
            }
            catch (err) {
                console.error(`Failed to load Yjs doc from Redis for ${key}:`, err);
            }
        }
        return doc;
    }
    getDocSync(roomId, fileId) {
        const key = `${roomId}:${fileId}`;
        let doc = this.docs.get(key);
        if (!doc) {
            doc = new Y.Doc();
            this.docs.set(key, doc);
        }
        return doc;
    }
    async persistDoc(roomId, fileId) {
        const key = `${roomId}:${fileId}`;
        const doc = this.docs.get(key);
        if (!doc)
            return;
        try {
            const update = Y.encodeStateAsUpdate(doc);
            const base64 = Buffer.from(update).toString("base64");
            await this.redis.set(`yjs:doc:${key}`, base64, "EX", 86400);
        }
        catch (err) {
            console.error(`Failed to persist Yjs doc to Redis for ${key}:`, err);
        }
    }
    applyRemoteUpdate(roomId, fileId, update) {
        const key = `${roomId}:${fileId}`;
        let doc = this.docs.get(key);
        if (!doc) {
            doc = new Y.Doc();
            this.docs.set(key, doc);
        }
        const binaryUpdate = update instanceof Uint8Array ? update : new Uint8Array(update);
        Y.applyUpdate(doc, binaryUpdate);
    }
    async deleteDoc(roomId, fileId) {
        const key = `${roomId}:${fileId}`;
        const doc = this.docs.get(key);
        if (doc) {
            doc.destroy();
            this.docs.delete(key);
        }
        try {
            await this.redis.del(`yjs:doc:${key}`);
        }
        catch (err) {
            console.error(`Failed to delete Yjs doc from Redis for ${key}:`, err);
        }
    }
    async deleteRoomDocs(roomId) {
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
        }
        catch (err) {
            console.error(`Failed to delete room docs from Redis for ${roomId}:`, err);
        }
    }
}
exports.YjsStore = YjsStore;
//# sourceMappingURL=yjStore.js.map