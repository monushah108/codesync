import type Redis from "ioredis";
import type { ConnectedUser, User } from "../types.js";
export declare class PresenceStore {
    private redis;
    constructor(redis: Redis);
    set(socketId: string, user: ConnectedUser): Promise<void>;
    get(socketId: string): Promise<ConnectedUser | null>;
    delete(socketId: string): Promise<ConnectedUser | null>;
    getRoomMembers(roomId: string): Promise<User[]>;
    getRoomMemberCount(roomId: string): Promise<number>;
    has(socketId: string): Promise<boolean>;
}
//# sourceMappingURL=presence.d.ts.map