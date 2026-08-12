import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";
import { PresenceStore } from "../store/presence.js";
interface AIHandlerDeps {
    io: Server;
    groq: Groq;
    presence: PresenceStore;
}
export declare function registerAIHandlers(socket: Socket, { io, groq, presence }: AIHandlerDeps): void;
export {};
//# sourceMappingURL=aiChat.d.ts.map