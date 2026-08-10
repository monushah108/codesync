"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./services/socket"));
function init() {
    const httpServer = http_1.default.createServer();
    const PORT = process.env.PORT ?? 3001;
    const socketService = new socket_1.default();
    socketService.io.attach(httpServer);
    socketService.initListeners();
    httpServer.listen(PORT, () => console.log("http server at port:3001"));
}
init();
//# sourceMappingURL=index.js.map