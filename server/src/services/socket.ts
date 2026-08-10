import { Server } from "socket.io";
import Groq from "groq-sdk";
import * as Y from "yjs";

import type { ConnectedUser, Room } from "./types.js";
import { registerRoomHandlers } from "./handlers/room.js";
import { registerYjsHandlers } from "./handlers/yjs.js";
import { registerAIHandlers } from "./handlers/ai.js";

export default class SocketServices {
  private readonly _io: Server;

  private readonly users = new Map<string, ConnectedUser>();

  private readonly rooms = new Map<string, Room>();

  private readonly docs = new Map<string, Y.Doc>();

  private readonly aiGenerating = new Set<string>();

  private readonly groq: Groq;

  constructor() {
    this._io = new Server();

    this.groq = new Groq({
      apiKey: process.env.AI_API_KEY!,
    });
  }

  public initListeners() {
    this._io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      registerRoomHandlers(socket, {
        io: this._io,
        rooms: this.rooms,
        users: this.users,
      });

      registerYjsHandlers(socket, {
        io: this._io,
        rooms: this.rooms,
        users: this.users,
        docs: this.docs,
      });

      registerAIHandlers(socket, {
        io: this._io,
        rooms: this.rooms,
        aiGenerating: this.aiGenerating,
        groq: this.groq,
      });

      socket.on("disconnect", () => {
        const connectedUser = this.users.get(socket.id);

        if (!connectedUser) {
          return;
        }

        const room = this.rooms.get(connectedUser.roomId);

        this.users.delete(socket.id);

        if (!room) {
          return;
        }

        room.members.delete(connectedUser.user.id);

        this._io
          .to(room.roomId)
          .emit("members", Array.from(room.members.values()));

        this._io.to(room.roomId).emit("activity", {
          id: crypto.randomUUID(),
          userId: connectedUser.user.id,
          userName: connectedUser.user.name,
          type: "leave",
          time: new Date().toLocaleTimeString(),
        });

        if (room.members.size === 0) {
          this.rooms.delete(room.roomId);
        }
      });
    });
  }

  public get io() {
    return this._io;
  }
}
