import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";

import SocketService from "./services/socket.js";

function init() {
  const PORT = Number(process.env.PORT) || 8000;

  const httpServer = http.createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const socketService = new SocketService(io);

  socketService.initListeners();

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Socket server running on port ${PORT}`);
  });
}

init();
