import type { Server, Socket } from "socket.io";
import { YjsStore } from "../store/yjStore.js";
interface YjsHandlerDeps {
    io: Server;
    yjs: YjsStore;
    serverId: string;
}
export declare function registerYjsHandlers(socket: Socket, { io, yjs, serverId }: YjsHandlerDeps): void;
export {};
//# sourceMappingURL=yjs.d.ts.map