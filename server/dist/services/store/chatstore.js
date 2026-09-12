"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatStore = void 0;
class ChatStore {
    history = new Map();
    getHistory(roomId, type) {
        const messages = this.history.get(roomId) ?? [];
        if (!type) {
            return messages;
        }
        return messages.filter((message) => message.type === type);
    }
    setHistory(roomId, content, type, role, userId, userName) {
        const message = role === "user"
            ? {
                id: crypto.randomUUID(),
                type,
                content,
                role,
                userId: userId,
                userName: userName,
                createdAt: Date.now(),
            }
            : {
                id: crypto.randomUUID(),
                type,
                content,
                role,
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