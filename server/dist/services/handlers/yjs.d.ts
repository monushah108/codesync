import type { Server, Socket } from "socket.io";
import * as Y from "yjs";
import type { ConnectedUser, Room } from "../types.js";
type YjsDeps = {
    io: Server;
    rooms: Map<string, Room>;
    users: Map<string, ConnectedUser>;
    docs: Map<string, Y.Doc>;
};
export declare function registerYjsHandlers(socket: Socket, { rooms, docs }: YjsDeps): void;
export {};
//# sourceMappingURL=yjs.d.ts.map