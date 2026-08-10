import type { Server, Socket } from "socket.io";
import type { ConnectedUser, Room } from "../types.js";
type RoomHandlerDeps = {
    io: Server;
    rooms: Map<string, Room>;
    users: Map<string, ConnectedUser>;
};
export declare function registerRoomHandlers(socket: Socket, { io, rooms, users }: RoomHandlerDeps): void;
export {};
//# sourceMappingURL=room.d.ts.map