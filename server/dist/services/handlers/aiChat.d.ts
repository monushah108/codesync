import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";
interface AIHandlerDeps {
    io: Server;
    groq: Groq;
}
export declare function registerAIHandlers(socket: Socket, { io, groq }: AIHandlerDeps): void;
export {};
//# sourceMappingURL=aiChat.d.ts.map