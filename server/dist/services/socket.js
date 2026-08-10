"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const room_js_1 = require("./handlers/room.js");
const yjs_js_1 = require("./handlers/yjs.js");
const ai_js_1 = require("./handlers/ai.js");
class SocketServices {
    _io;
    users = new Map();
    rooms = new Map();
    docs = new Map();
    aiGenerating = new Set();
    groq;
    constructor() {
        this._io = new socket_io_1.Server();
        this.groq = new groq_sdk_1.default({
            apiKey: process.env.AI_API_KEY,
        });
    }
    initListeners() {
        this._io.on("connection", (socket) => {
            console.log(`Socket connected: ${socket.id}`);
            (0, room_js_1.registerRoomHandlers)(socket, {
                io: this._io,
                rooms: this.rooms,
                users: this.users,
            });
            (0, yjs_js_1.registerYjsHandlers)(socket, {
                io: this._io,
                rooms: this.rooms,
                users: this.users,
                docs: this.docs,
            });
            (0, ai_js_1.registerAIHandlers)(socket, {
                io: this._io,
                rooms: this.rooms,
                aiGenerating: this.aiGenerating,
                groq: this.groq,
            });
            socket.on("disconnect", () => {
                const connectedUser = this.users.get(socket.id);
                if (!connectedUser) {
                    return;
                }
                const room = this.rooms.get(connectedUser.roomId);
                this.users.delete(socket.id);
                if (!room) {
                    return;
                }
                room.members.delete(connectedUser.user.id);
                this._io
                    .to(room.roomId)
                    .emit("members", Array.from(room.members.values()));
                this._io.to(room.roomId).emit("activity", {
                    id: crypto.randomUUID(),
                    userId: connectedUser.user.id,
                    userName: connectedUser.user.name,
                    type: "leave",
                    time: new Date().toLocaleTimeString(),
                });
                if (room.members.size === 0) {
                    this.rooms.delete(room.roomId);
                }
            });
        });
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketServices;
//# sourceMappingURL=socket.js.map