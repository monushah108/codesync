"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const presence_1 = require("./store/presence");
const yjStore_1 = require("./store/yjStore");
const yjs_1 = require("./handlers/yjs");
const explorer_1 = require("./handlers/explorer");
const aiChat_1 = require("./handlers/aiChat");
const activity_1 = require("./handlers/activity");
class SocketService {
    _io;
    presence = new presence_1.PresenceStore();
    yjs = new yjStore_1.YjsStore();
    groq = new groq_sdk_1.default({
        apiKey: process.env.AI_API_KEY,
    });
    constructor(io) {
        this._io = io;
    }
    initListeners() {
        this._io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);
            (0, yjs_1.registerYjsHandlers)(socket, {
                io: this._io,
                yjs: this.yjs,
            });
            (0, explorer_1.registerExplorerHandlers)(socket, {
                io: this._io,
                presence: this.presence,
            });
            (0, aiChat_1.registerAIHandlers)(socket, {
                io: this._io,
                groq: this.groq,
            });
            (0, activity_1.registerActivityHandlers)(socket);
            socket.on("disconnect", () => {
                this.handleDisconnect(socket);
            });
        });
    }
    handleDisconnect(socket) {
        const member = this.presence.get(socket.id);
        if (!member) {
            return;
        }
        this.presence.delete(socket.id);
        const members = this.presence.getRoomMembers(member.roomId);
        this._io.to(member.roomId).emit("members", members);
        socket.to(member.roomId).emit("activity", {
            id: crypto.randomUUID(),
            userId: member.user.id,
            userName: member.user.name,
            type: "leave",
            time: new Date().toLocaleTimeString(),
        });
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
//# sourceMappingURL=socket.js.map