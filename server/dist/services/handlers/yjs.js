"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYjsHandlers = registerYjsHandlers;
const Y = __importStar(require("yjs"));
function registerYjsHandlers(socket, { io, yjs }) {
    let currentFileRoom = null;
    socket.on("yjs:join", ({ roomId, fileId }) => {
        if (!roomId || !fileId) {
            socket.emit("yjs:error", {
                message: "Invalid room or file.",
            });
            return;
        }
        const roomKey = `${roomId}:${fileId}`;
        if (currentFileRoom && currentFileRoom !== roomKey) {
            socket.leave(currentFileRoom);
        }
        socket.join(roomKey);
        currentFileRoom = roomKey;
        const doc = yjs.getDoc(roomId, fileId);
        socket.emit("yjs:sync", {
            update: Array.from(Y.encodeStateAsUpdate(doc)),
        });
        console.log("Joined:", roomKey);
    });
    socket.on("yjs:update", ({ roomId, fileId, update, }) => {
        const roomKey = `${roomId}:${fileId}`;
        const doc = yjs.getDoc(roomId, fileId);
        const binaryUpdate = new Uint8Array(update);
        Y.applyUpdate(doc, binaryUpdate);
        socket.to(roomKey).emit("yjs:update", {
            update,
        });
    });
    socket.on("yjs:awareness", ({ roomId, fileId, update }) => {
        const roomKey = `${roomId}:${fileId}`;
        socket.to(roomKey).emit("yjs:awareness", {
            update,
        });
    });
    socket.on("disconnect", () => {
        if (!currentFileRoom)
            return;
        socket.leave(currentFileRoom);
    });
}
//# sourceMappingURL=yjs.js.map