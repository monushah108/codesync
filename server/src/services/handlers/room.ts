import type { Server, Socket } from "socket.io";
import { randomUUID } from "node:crypto";

import type { ConnectedUser, Room, User } from "../types.js";

type RoomHandlerDeps = {
  io: Server;
  rooms: Map<string, Room>;
  users: Map<string, ConnectedUser>;
};

export function registerRoomHandlers(
  socket: Socket,
  { io, rooms, users }: RoomHandlerDeps,
) {
  socket.on(
    "room:create",
    ({ roomId, user }: { roomId: string; user: User }) => {
      if (!roomId || !user?.id) {
        socket.emit("socket:error", {
          event: "room:create",
          message: "Invalid room data.",
        });

        return;
      }

      if (users.has(socket.id)) {
        socket.emit("socket:error", {
          event: "room:create",
          message: "You are already in a room.",
        });

        return;
      }

      if (rooms.has(roomId)) {
        socket.emit("room:exists");
        return;
      }

      const room: Room = {
        roomId,
        adminId: user.id,
        members: new Map(),
      };

      room.members.set(user.id, user);

      rooms.set(roomId, room);

      users.set(socket.id, {
        roomId,
        user,
      });

      socket.join(roomId);

      socket.emit("room:created", {
        roomId,
      });

      io.to(roomId).emit("members", Array.from(room.members.values()));
    },
  );

  socket.on("room:join", ({ roomId, user }: { roomId: string; user: User }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit("room:not-found");
      return;
    }

    if (users.has(socket.id)) {
      socket.emit("socket:error", {
        event: "room:join",
        message: "You are already in a room.",
      });

      return;
    }

    if (room.members.has(user.id)) {
      socket.emit("room:already-joined");
      return;
    }

    room.members.set(user.id, user);

    users.set(socket.id, {
      roomId,
      user,
    });

    socket.join(roomId);

    io.to(roomId).emit("members", Array.from(room.members.values()));

    socket.to(roomId).emit("activity", {
      id: randomUUID(),
      userId: user.id,
      userName: user.name,
      type: "join",
      time: new Date().toLocaleTimeString(),
    });
  });

  socket.on("room:leave", ({ roomId }: { roomId: string }) => {
    const connectedUser = users.get(socket.id);

    if (!connectedUser) {
      return;
    }

    if (connectedUser.roomId !== roomId) {
      return;
    }

    const room = rooms.get(roomId);

    if (!room) {
      users.delete(socket.id);
      return;
    }

    const user = connectedUser.user;

    room.members.delete(user.id);
    users.delete(socket.id);

    socket.leave(roomId);

    io.to(roomId).emit("members", Array.from(room.members.values()));

    socket.to(roomId).emit("activity", {
      id: randomUUID(),
      userId: user.id,
      userName: user.name,
      type: "leave",
      time: new Date().toLocaleTimeString(),
    });

    if (room.members.size === 0) {
      rooms.delete(roomId);
    }
  });
}
