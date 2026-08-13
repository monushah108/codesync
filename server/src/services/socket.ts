import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";
import { PresenceStore } from "./store/presence";
import { YjsStore } from "./store/yjStore";
import { registerYjsHandlers } from "./handlers/yjs";
import { registerExplorerHandlers } from "./handlers/room";
import { registerAIHandlers } from "./handlers/aiChat";
import { registerActivityHandlers } from "./handlers/activity";

class SocketService {
  private readonly _io: Server;

  private readonly presence = new PresenceStore();

  private readonly yjs = new YjsStore();

  private readonly groq = new Groq({
    apiKey: process.env.AI_API_KEY!,
  });

  constructor(io: Server) {
    this._io = io;
  }

  public initListeners() {
    this._io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      registerYjsHandlers(socket, {
        io: this._io,
        yjs: this.yjs,
      });

      registerExplorerHandlers(socket, {
        io: this._io,
        presence: this.presence,
        yjs: this.yjs,
      });

      registerAIHandlers(socket, {
        io: this._io,
        groq: this.groq,
        presence: this.presence,
      });

      registerActivityHandlers(socket);

      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private handleDisconnect(socket: Socket) {
    const member = this.presence.get(socket.id);
    if (!member) {
      return;
    }

    this.presence.delete(socket.id);

    const members = this.presence.getRoomMembers(member.roomId);

    if (members.length == 0) {
      console.log(this.yjs);
      this.yjs.deleteRoomDocs(member.roomId);
    }
    this._io.to(member.roomId).emit("members", members);

    socket.to(member.roomId).emit("activity", {
      id: crypto.randomUUID(),
      userId: member.user.id,
      userName: member.user.name,
      type: "leave",
      time: new Date().toLocaleTimeString(),
    });
  }

  public get io() {
    return this._io;
  }
}

export default SocketService;
