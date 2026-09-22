import type { Server } from "socket.io";
declare class SocketService {
    private readonly _io;
    private readonly serverId;
    private readonly presence;
    private readonly yjs;
    private readonly chatStore;
    private readonly groq;
    private readonly redis;
    private readonly redisSubscriber;
    private redisReady;
    private redisErrorLogged;
    private subscriberReady;
    private subscriberErrorLogged;
    constructor(io: Server);
    initListeners(): void;
    private handleDisconnect;
    close(): Promise<void>;
    get io(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}
export default SocketService;
//# sourceMappingURL=socket.d.ts.map