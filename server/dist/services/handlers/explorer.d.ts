import type { Server, Socket } from "socket.io";
import { PresenceStore } from "../store/presence.js";
interface ExplorerHandlerDeps {
    io: Server;
    presence: PresenceStore;
}
export declare function registerExplorerHandlers(socket: Socket, { io, presence }: ExplorerHandlerDeps): void;
export {};
//# sourceMappingURL=explorer.d.ts.map