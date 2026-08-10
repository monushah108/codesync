import type { Server } from "socket.io";
declare class SocketService {
    private readonly _io;
    private readonly presence;
    private readonly yjs;
    private readonly groq;
    constructor(io: Server);
    initListeners(): void;
    private handleDisconnect;
    get io(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}
export default SocketService;
//# sourceMappingURL=socket.d.ts.map