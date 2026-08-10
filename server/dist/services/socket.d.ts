import { Server } from "socket.io";
export default class SocketServices {
    private readonly _io;
    private readonly users;
    private readonly rooms;
    private readonly docs;
    private readonly aiGenerating;
    private readonly groq;
    constructor();
    initListeners(): void;
    get io(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
}
//# sourceMappingURL=socket.d.ts.map