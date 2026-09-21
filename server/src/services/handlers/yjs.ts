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
    ({
      roomId,
      fileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content?: string;
    }) => {
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
      const text = doc.getText("editor");

      // When y doc has content, don't insert content.
      // If it does not have content, insert it from db.
      if (text.length === 0 && content) {
        text.insert(0, content);
      }

      socket.emit("yjs:sync", {
        roomId,
        fileId,
        update: Array.from(Y.encodeStateAsUpdate(doc)),
      });
    },
  );

  socket.on(
    "yjs:init",
    ({
      roomId,
      fileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content: string;
    }) => {
      if (!roomId || !fileId || !content) return;

      const doc = yjs.getDoc(roomId, fileId);
      const text = doc.getText("editor");

      // When y doc has content, don't insert content.
      // If it does not have content, insert it from db.
      if (text.length === 0) {
        text.insert(0, content);

        const roomKey = `${roomId}:${fileId}`;
        const syncUpdate = Array.from(Y.encodeStateAsUpdate(doc));
        io.to(roomKey).emit("yjs:sync", {
          roomId,
          fileId,
          update: syncUpdate,
        });
      }
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
        roomId,
        fileId,
        update,
      });
    },
  );

  socket.on("yjs:awareness", ({ roomId, fileId, update }) => {
    const roomKey = `${roomId}:${fileId}`;

    socket.to(roomKey).emit("yjs:awareness", {
      roomId,
      fileId,
      update,
    });
  });

  socket.on(
    "file:saved",
    ({
      roomId,
      fileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content: string;
    }) => {
      if (!roomId || !fileId) return;

      socket.to(roomId).emit("file:saved", { roomId, fileId, content });
      socket.to(`${roomId}:${fileId}`).emit("file:saved", { roomId, fileId, content });
    },
  );

  socket.on("disconnect", () => {
    if (!currentFileRoom) return;

    socket.leave(currentFileRoom);
  });
}
