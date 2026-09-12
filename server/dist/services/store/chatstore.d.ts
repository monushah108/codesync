type ChatMessage = {
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
    private history;
    getHistory(roomId: string): ChatMessage[];
    setHistory(roomId: string, content: string, role: "user" | "assistant", userId?: string, userName?: string): ChatMessage;
    deleteHistory(roomId: string): void;
    deleteAllHistory(): void;
}
export {};
//# sourceMappingURL=chatstore.d.ts.map