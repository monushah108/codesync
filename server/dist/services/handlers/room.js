"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExplorerHandlers = registerExplorerHandlers;
const node_crypto_1 = require("node:crypto");
function registerExplorerHandlers(socket, { io, presence, yjs }) {
    socket.on("room:join", ({ roomId, user }) => {
        if (!roomId || !user?.id) {
            socket.emit("error", {
                message: "Invalid data.",
            });
            return;
        }
        const members = presence.getRoomMembers(roomId);
        if (members.length >= 4) {
            socket.emit("error", {
                message: "Room is full. Maximum 4 users are allowed.",
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
    socket.on("room:leave", ({ roomId }) => {
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
        if (type == "remove") {
            yjs.deleteDoc(roomId, payload.file?.id);
        }
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
        socket.to(roomId).emit("explorer:operation", {
            user,
            type,
            target,
            payload,
        });
    });
    socket.on("terminal", ({ roomId, data, action }) => {
        socket.to(roomId).emit("terminal", {
            data,
            action,
        });
    });
    socket.on("file:saved", ({ roomId, fileId, content, }) => {
        if (!roomId || !fileId)
            return;
        socket.to(roomId).emit("file:saved", {
            roomId,
            fileId,
            content,
        });
        socket.to(`${roomId}:${fileId}`).emit("file:saved", {
            roomId,
            fileId,
            content,
        });
    });
    socket.on("member:role-update", ({ roomId, targetUserId, newRole, memberName }) => {
        io.to(roomId).emit("member:role-updated", {
            targetUserId,
            newRole,
            memberName,
        });
    });
    socket.on("member:kick", ({ roomId, targetUserId, reason, memberName }) => {
        io.to(roomId).emit("member:kicked", {
            targetUserId,
            reason,
            memberName,
        });
    });
}
//# sourceMappingURL=room.js.map