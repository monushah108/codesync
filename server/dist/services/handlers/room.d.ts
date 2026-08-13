import type { Server, Socket } from "socket.io";
import { PresenceStore } from "../store/presence.js";
import { YjsStore } from "../store/yjStore.js";
interface ExplorerHandlerDeps {
    io: Server;
    presence: PresenceStore;
    yjs: YjsStore;
}
export declare function registerExplorerHandlers(socket: Socket, { io, presence, yjs }: ExplorerHandlerDeps): void;
export {};
//# sourceMappingURL=room.d.ts.map