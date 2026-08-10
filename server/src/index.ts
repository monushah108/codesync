import "dotenv/config";
import http from "http";
import SocketService from "./services/socket";

function init() {
  const httpServer = http.createServer();
  const PORT = process.env.PORT ?? 3001;

  const socketService = new SocketService();

  socketService.io.attach(httpServer);
  socketService.initListeners();

  httpServer.listen(PORT, () => console.log("http server at port:3001"));
}

init();
