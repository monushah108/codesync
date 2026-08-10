import type { Server, Socket } from "socket.io";
import { Room } from "../types";
type AIDeps = {
    io: Server;
    rooms: Map<string, Room>;
    aiGenerating: Set<string>;
    groq: any;
};
export declare function registerAIHandlers(socket: Socket, { io, rooms, aiGenerating, groq }: AIDeps): void;
export {};
//# sourceMappingURL=ai.d.ts.map