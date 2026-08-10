"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceStore = void 0;
class PresenceStore {
    users = new Map();
    set(socketId, user) {
        this.users.set(socketId, user);
    }
    get(socketId) {
        return this.users.get(socketId);
    }
    delete(socketId) {
        this.users.delete(socketId);
    }
    getRoomMembers(roomId) {
        return [...this.users.values()]
            .filter((member) => member.roomId === roomId)
            .map((member) => member.user);
    }
    has(socketId) {
        return this.users.has(socketId);
    }
}
exports.PresenceStore = PresenceStore;
//# sourceMappingURL=presence.js.map