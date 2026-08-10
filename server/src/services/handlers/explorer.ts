import type { Server, Socket } from "socket.io";
import { randomUUID } from "node:crypto";

import type { User } from "../types.js";
import { PresenceStore } from "../store/presence.js";

interface ExplorerHandlerDeps {
  io: Server;
  presence: PresenceStore;
}

export function registerExplorerHandlers(
  socket: Socket,
  { io, presence }: ExplorerHandlerDeps,
) {
  socket.on(
    "explorer:join",
    ({ roomId, user }: { roomId: string; user: User }) => {
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
        id: randomUUID(),
        userId: user.id,
        userName: user.name,
        type: "join",
        time: new Date().toLocaleTimeString(),
      });
    },
  );

  socket.on("explorer:leave", ({ roomId }: { roomId: string }) => {
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

    socket.to(roomId).emit("explorer:operation", {
      user,
      type,
      target,
      payload,
    });

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
  });
}
