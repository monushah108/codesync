"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
// import SocketService from "./services/socket";
function init() {
    //   const socketService = new SocketService();
    const httpServer = http_1.default.createServer();
    const PORT = process.env.PORT ?? 8000;
    //   socketService.io.attach(httpServer);
    //   socketService.initListeners();
    httpServer.listen(PORT, () => console.log("http server at port:8000"));
}
init();
//# sourceMappingURL=index.js.map