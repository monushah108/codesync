import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";

import SocketService from "./services/socket.js";

function init() {
  const PORT = Number(process.env.PORT) || 8000;

  const httpServer = http.createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3001",
      credentials: true,
    },
  });

  const socketService = new SocketService(io);

  socketService.initListeners();

  httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
  });
}

init();
