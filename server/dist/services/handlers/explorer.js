"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExplorerHandlers = registerExplorerHandlers;
const node_crypto_1 = require("node:crypto");
function registerExplorerHandlers(socket, { io, presence }) {
    socket.on("explorer:join", ({ roomId, user }) => {
        if (!roomId || !user?.id) {
            socket.emit("socket:error", {
                event: "explorer:join",
                message: "Invalid data.",
            });
            return;
        }
        presence.set(socket.id, {
            roomId,
            user,
        });
        socket.join(roomId);
        io.to(roomId).emit("members", presence.getRoomMembers(roomId));
        socket.to(roomId).emit("activity", {
            id: (0, node_crypto_1.randomUUID)(),
            userId: user.id,
            userName: user.name,
            type: "join",
            time: new Date().toLocaleTimeString(),
        });
    });
    socket.on("explorer:leave", ({ roomId }) => {
        const member = presence.get(socket.id);
        if (!member) {
            return;
        }
        if (member.roomId !== roomId) {
            return;
        }
        presence.delete(socket.id);
        socket.leave(roomId);
        io.to(roomId).emit("members", presence.getRoomMembers(roomId));
        socket.to(roomId).emit("activity", {
            id: (0, node_crypto_1.randomUUID)(),
            userId: member.user.id,
            userName: member.user.name,
            type: "leave",
            time: new Date().toLocaleTimeString(),
        });
    });
    socket.on("explorer:operation", ({ roomId, user, type, target, payload }) => {
        const fileName = payload.file?.name ?? payload.folder?.name ?? payload.newName ?? "";
        socket.to(roomId).emit("explorer:operation", {
            user,
            type,
            target,
            payload,
        });
        socket.to(roomId).emit("activity", {
            id: (0, node_crypto_1.randomUUID)(),
            userId: user.id,
            userName: user.name,
            type,
            target,
            fileName,
            time: new Date().toLocaleTimeString(),
            message: `${user.name} has ${type} ${target} "${fileName}"`,
        });
    });
}
//# sourceMappingURL=explorer.js.map