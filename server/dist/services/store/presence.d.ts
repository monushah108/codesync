import type { ConnectedUser } from "../types.js";
export declare class PresenceStore {
    private users;
    set(socketId: string, user: ConnectedUser): void;
    get(socketId: string): ConnectedUser | undefined;
    delete(socketId: string): void;
    getRoomMembers(roomId: string): import("../types.js").User[];
    has(socketId: string): boolean;
}
//# sourceMappingURL=presence.d.ts.map