import type { Server, Socket } from "socket.io";
import { YjsStore } from "../store/yjStore";
interface YjsHandlerDeps {
    io: Server;
    yjs: YjsStore;
}
export declare function registerYjsHandlers(socket: Socket, { io, yjs }: YjsHandlerDeps): void;
export {};
//# sourceMappingURL=yjs.d.ts.map