"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExplorerHandlers = registerExplorerHandlers;
const node_crypto_1 = require("node:crypto");
function registerExplorerHandlers(socket, { io, presence, yjs }) {
    socket.on("room:join", async ({ roomId, user }) => {
        if (!roomId || !user?.id) {
            socket.emit("error", {
                message: "Invalid data.",
            });
            return;
        }
        const currentMembers = await presence.getRoomMembers(roomId);
        const isAlreadyMember = currentMembers.some((m) => m.id === user.id);
        if (!isAlreadyMember && currentMembers.length >= 4) {
            socket.emit("error", {
                message: "Room is full. Maximum 4 users are allowed.",
            });
            return;
        }
        await presence.set(socket.id, {
            roomId,
            user,
        });
        socket.join(roomId);
        const updatedMembers = await presence.getRoomMembers(roomId);
        io.to(roomId).emit("members", updatedMembers);
        socket.to(roomId).emit("activity", {
            id: (0, node_crypto_1.randomUUID)(),
            userId: user.id,
            userName: user.name,
            type: "join",
            time: new Date().toLocaleTimeString(),
        });
    });
    socket.on("room:leave", async ({ roomId }) => {
        const member = await presence.get(socket.id);
        if (!member) {
            return;
        }
        if (member.roomId !== roomId) {
            return;
        }
        await presence.delete(socket.id);
        socket.leave(roomId);
        const remainingMembers = await presence.getRoomMembers(roomId);
        io.to(roomId).emit("members", remainingMembers);
        socket.to(roomId).emit("activity", {
            id: (0, node_crypto_1.randomUUID)(),
            userId: member.user.id,
            userName: member.user.name,
            type: "leave",
            time: new Date().toLocaleTimeString(),
        });
    });
    socket.on("explorer:operation", async ({ roomId, user, type, target, payload }) => {
        const fileName = payload.file?.name ?? payload.folder?.name ?? payload.newName ?? "";
        if (type == "remove" && payload.file?.id) {
            await yjs.deleteDoc(roomId, payload.file.id);
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
    socket.on("member:role-update", ({ roomId, targetUserId, newRole, memberName, }) => {
        io.to(roomId).emit("member:role-updated", {
            targetUserId,
            newRole,
            memberName,
        });
    });
    socket.on("member:kick", ({ roomId, targetUserId, reason, memberName, }) => {
        io.to(roomId).emit("member:kicked", {
            targetUserId,
            reason,
            memberName,
        });
    });
}
//# sourceMappingURL=room.js.map