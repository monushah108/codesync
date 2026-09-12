type ChatMessage = {
    id: string;
    type: "ai" | "chat";
    content: string;
    role: "user";
    userId: string;
    userName: string;
    createdAt: number;
} | {
    id: string;
    type: "ai" | "chat";
    content: string;
    role: "assistant";
    createdAt: number;
};
export declare class ChatStore {
    private history;
    getHistory(roomId: string, type?: "ai" | "chat"): ChatMessage[];
    setHistory(roomId: string, content: string, type: "ai" | "chat", role: "user", userId: string, userName: string): ChatMessage;
    setHistory(roomId: string, content: string, type: "ai" | "chat", role: "assistant"): ChatMessage;
    deleteHistory(roomId: string): void;
    deleteAllHistory(): void;
}
export {};
//# sourceMappingURL=chatstore.d.ts.map