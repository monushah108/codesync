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
function registerYjsHandlers(socket, { io, yjs, serverId }) {
    let currentFileRoom = null;
    socket.on("yjs:join", async ({ roomId, fileId, content, }) => {
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
        const doc = await yjs.getDoc(roomId, fileId);
        const text = doc.getText("editor");
        // When y doc has content, don't insert content.
        // If it does not have content, insert it from db.
        if (text.length === 0 && content) {
            text.insert(0, content);
            await yjs.persistDoc(roomId, fileId);
        }
        socket.emit("yjs:sync", {
            roomId,
            fileId,
            update: Array.from(Y.encodeStateAsUpdate(doc)),
        });
        // Request existing file collaborators to broadcast their awareness
        socket.to(roomKey).emit("yjs:awareness:request", {
            roomId,
            fileId,
        });
    });
    socket.on("yjs:init", async ({ roomId, fileId, content, }) => {
        if (!roomId || !fileId || !content)
            return;
        const doc = await yjs.getDoc(roomId, fileId);
        const text = doc.getText("editor");
        // When y doc has content, don't insert content.
        // If it does not have content, insert it from db.
        if (text.length === 0) {
            text.insert(0, content);
            await yjs.persistDoc(roomId, fileId);
            const roomKey = `${roomId}:${fileId}`;
            const syncUpdate = Array.from(Y.encodeStateAsUpdate(doc));
            io.to(roomKey).emit("yjs:sync", {
                roomId,
                fileId,
                update: syncUpdate,
            });
            io.serverSideEmit("yjs:remote_update", {
                serverId,
                roomId,
                fileId,
                update: syncUpdate,
            });
        }
    });
    socket.on("yjs:update", async ({ roomId, fileId, update, }) => {
        const roomKey = `${roomId}:${fileId}`;
        const doc = await yjs.getDoc(roomId, fileId);
        const binaryUpdate = new Uint8Array(update);
        Y.applyUpdate(doc, binaryUpdate);
        await yjs.persistDoc(roomId, fileId);
        socket.to(roomKey).emit("yjs:update", {
            roomId,
            fileId,
            update,
        });
        io.serverSideEmit("yjs:remote_update", {
            serverId,
            roomId,
            fileId,
            update,
        });
    });
    socket.on("yjs:awareness", ({ roomId, fileId, update }) => {
        const roomKey = `${roomId}:${fileId}`;
        socket.to(roomKey).emit("yjs:awareness", {
            roomId,
            fileId,
            update,
        });
    });
    socket.on("file:saved", ({ roomId, fileId, content, }) => {
        if (!roomId || !fileId)
            return;
        socket.to(roomId).emit("file:saved", { roomId, fileId, content });
        socket.to(`${roomId}:${fileId}`).emit("file:saved", { roomId, fileId, content });
    });
    socket.on("disconnect", () => {
        if (!currentFileRoom)
            return;
        socket.leave(currentFileRoom);
    });
}
//# sourceMappingURL=yjs.js.map