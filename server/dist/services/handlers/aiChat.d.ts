import type { Server, Socket } from "socket.io";
import Groq from "groq-sdk";
import type Redis from "ioredis";
import { PresenceStore } from "../store/presence.js";
import { YjsStore } from "../store/yjStore.js";
import { ChatStore } from "../store/chatstore.js";
interface AIHandlerDeps {
    io: Server;
    groq: Groq;
    presence: PresenceStore;
    yjs: YjsStore;
    chatStore: ChatStore;
    redis: Redis;
}
export declare function registerAIHandlers(socket: Socket, { io, groq, presence, yjs, chatStore, redis }: AIHandlerDeps): void;
export {};
//# sourceMappingURL=aiChat.d.ts.map