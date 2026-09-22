import type Redis from "ioredis";
export type ChatMessage = {
    id: string;
    content: string;
    role: "user";
    userId: string;
    userName: string;
    createdAt: number;
} | {
    id: string;
    content: string;
    role: "assistant";
    createdAt: number;
};
export declare class ChatStore {
    private redis;
    constructor(redis: Redis);
    getHistory(roomId: string): Promise<ChatMessage[]>;
    setHistory(roomId: string, content: string, role: "user" | "assistant", userId?: string, userName?: string): Promise<ChatMessage>;
    deleteHistory(roomId: string): Promise<void>;
    deleteAllHistory(): Promise<void>;
}
//# sourceMappingURL=chatstore.d.ts.map