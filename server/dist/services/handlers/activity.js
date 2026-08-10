"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerActivityHandlers = registerActivityHandlers;
function registerActivityHandlers(socket) {
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
//# sourceMappingURL=activity.js.map