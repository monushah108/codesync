import type { Server, Socket } from "socket.io";
import * as Y from "yjs";
import { YjsStore } from "../store/yjStore";

interface YjsHandlerDeps {
  io: Server;
  yjs: YjsStore;
}

export function registerYjsHandlers(
  socket: Socket,
  { io, yjs }: YjsHandlerDeps,
) {
  let currentFileRoom: string | null = null;

  socket.on(
    "yjs:join",
    ({ roomId, fileId }: { roomId: string; fileId: string }) => {
      if (!roomId || !fileId) {
        socket.emit("yjs:error", {
          message: "Invalid room or file.",
        });

        return;
      }

      const roomKey = `${roomId}:${fileId}`;

      if (currentFileRoom && currentFileRoom !== roomKey) {
        socket.leave(currentFileRoom);
      }

      socket.join(roomKey);
      currentFileRoom = roomKey;

      const doc = yjs.getDoc(roomId, fileId);

      socket.emit("yjs:sync", {
        update: Array.from(Y.encodeStateAsUpdate(doc)),
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

      const doc = yjs.getDoc(roomId, fileId);
      const binaryUpdate = new Uint8Array(update);

      Y.applyUpdate(doc, binaryUpdate);

      socket.to(roomKey).emit("yjs:update", {
        update,
      });
    },
  );

  socket.on("yjs:awareness", ({ roomId, fileId, update }) => {
    const roomKey = `${roomId}:${fileId}`;

    socket.to(roomKey).emit("yjs:awareness", {
      update,
    });
  });

  socket.on("disconnect", () => {
    if (!currentFileRoom) return;

    socket.leave(currentFileRoom);
  });
}
