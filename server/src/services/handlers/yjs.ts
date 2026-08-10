import type { Server, Socket } from "socket.io";
import * as Y from "yjs";

import type { ConnectedUser, Room } from "../types.js";

type YjsDeps = {
  io: Server;
  rooms: Map<string, Room>;
  users: Map<string, ConnectedUser>;
  docs: Map<string, Y.Doc>;
};

export function registerYjsHandlers(socket: Socket, { rooms, docs }: YjsDeps) {
  socket.on(
    "yjs:join",
    ({ roomId, fileId }: { roomId: string; fileId: string }) => {
      const room = rooms.get(roomId);

      if (!room) {
        return;
      }

      const roomKey = `${roomId}:${fileId}`;

      socket.join(roomKey);

      let doc = docs.get(roomKey);

      if (!doc) {
        doc = new Y.Doc();
        docs.set(roomKey, doc);
      }

      const update = Y.encodeStateAsUpdate(doc);

      socket.emit("yjs:sync", {
        update: Array.from(update),
      });
    },
  );

  socket.on(
    "yjs:update",
    ({
      roomId,
      fileId,
      update,
    }: {
      roomId: string;
      fileId: string;
      update: number[];
    }) => {
      const roomKey = `${roomId}:${fileId}`;

      let doc = docs.get(roomKey);

      if (!doc) {
        doc = new Y.Doc();
        docs.set(roomKey, doc);
      }

      const uint8Update = new Uint8Array(update);

      Y.applyUpdate(doc, uint8Update);

      socket.to(roomKey).emit("yjs:update", {
        update,
      });
    },
  );

  socket.on(
    "yjs:awareness",
    ({
      roomId,
      fileId,
      update,
    }: {
      roomId: string;
      fileId: string;
      update: number[];
    }) => {
      const roomKey = `${roomId}:${fileId}`;

      socket.to(roomKey).emit("yjs:awareness", {
        update,
      });
    },
  );
}
