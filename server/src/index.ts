import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";

import SocketService from "./services/socket.js";

function init() {
  const PORT = Number(process.env.PORT) || 8000;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const httpServer = http.createServer();

  const io = new Server(httpServer, {
    cors: {
      origin: clientUrl.includes(",") ? clientUrl.split(",").map((s) => s.trim()) : clientUrl,
      credentials: true,
    },
  });

  const socketService = new SocketService(io);

  socketService.initListeners();

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Socket server running on port ${PORT}`);
  });

  const shutdown = async (signal: string) => {
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
