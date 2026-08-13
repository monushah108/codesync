import type { Server, Socket } from "socket.io";
import { randomUUID } from "node:crypto";

import type { User } from "../types.js";
import { PresenceStore } from "../store/presence.js";
import { YjsStore } from "../store/yjStore.js";

interface ExplorerHandlerDeps {
  io: Server;
  presence: PresenceStore;
  yjs: YjsStore;
}

export function registerExplorerHandlers(
  socket: Socket,
  { io, presence, yjs }: ExplorerHandlerDeps,
) {
  socket.on("room:join", ({ roomId, user }: { roomId: string; user: User }) => {
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
      id: randomUUID(),
      userId: user.id,
      userName: user.name,
      type: "join",
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("room:leave", ({ roomId }: { roomId: string }) => {
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
      id: randomUUID(),
      userId: member.user.id,
      userName: member.user.name,
      type: "leave",
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("explorer:operation", ({ roomId, user, type, target, payload }) => {
    const fileName =
      payload.file?.name ?? payload.folder?.name ?? payload.newName ?? "";

    if (type == "remove") {
      yjs.deleteDoc(roomId, payload.file?.id);
    }

    socket.to(roomId).emit("activity", {
      id: randomUUID(),
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
}
