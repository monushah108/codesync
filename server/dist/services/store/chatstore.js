"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatStore = void 0;
const node_crypto_1 = require("node:crypto");
class ChatStore {
    history = new Map();
    getHistory(roomId) {
        return this.history.get(roomId) ?? [];
    }
    setHistory(roomId, content, role, userId, userName) {
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
        const roomHistory = this.history.get(roomId) ?? [];
        roomHistory.push(message);
        this.history.set(roomId, roomHistory);
        return message;
    }
    deleteHistory(roomId) {
        this.history.delete(roomId);
    }
    deleteAllHistory() {
        this.history.clear();
    }
}
exports.ChatStore = ChatStore;
//# sourceMappingURL=chatstore.js.map