import type { Socket } from "socket.io";

export function registerActivityHandlers(socket: Socket) {
  socket.on("activity", ({ roomId, type, msg }) => {
    if (!roomId || !type) {
      return;
    }

    socket.to(roomId).emit("activity", {
      type,
      msg,
    });
  });
}
