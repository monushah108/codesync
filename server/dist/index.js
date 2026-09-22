"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_http_1 = __importDefault(require("node:http"));
const socket_io_1 = require("socket.io");
const socket_js_1 = __importDefault(require("./services/socket.js"));
function init() {
    const PORT = Number(process.env.PORT) || 8000;
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const httpServer = node_http_1.default.createServer();
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: clientUrl.includes(",") ? clientUrl.split(",").map((s) => s.trim()) : clientUrl,
            credentials: true,
        },
    });
    const socketService = new socket_js_1.default(io);
    socketService.initListeners();
    httpServer.listen(PORT, "0.0.0.0", () => {
        console.log(`Socket server running on port ${PORT}`);
    });
    const shutdown = async (signal) => {
        console.log(`\nReceived ${signal}. Shutting down gracefully...`);
        httpServer.close();
        io.close();
        await socketService.close();
        process.exit(0);
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
}
init();
//# sourceMappingURL=index.js.map