import { randomUUID } from "node:crypto";

type ChatMessage =
  | {
      id: string;
      content: string;
      role: "user";
      userId: string;
      userName: string;
      createdAt: number;
    }
  | {
      id: string;
      content: string;
      role: "assistant";
      createdAt: number;
    };

export class ChatStore {
  private history = new Map<string, ChatMessage[]>();

  getHistory(roomId: string): ChatMessage[] {
    return this.history.get(roomId) ?? [];
  }

  setHistory(
    roomId: string,
    content: string,
    role: "user" | "assistant",
    userId?: string,
    userName?: string,
  ): ChatMessage {
    const message: ChatMessage =
      role === "user"
        ? {
            id: randomUUID(),
            content,
            role: "user",
            userId: userId!,
            userName: userName!,
            createdAt: Date.now(),
          }
        : {
            id: randomUUID(),
            content,
            role: "assistant",
            createdAt: Date.now(),
          };

    const roomHistory = this.history.get(roomId) ?? [];

    roomHistory.push(message);
    this.history.set(roomId, roomHistory);

    return message;
  }

  deleteHistory(roomId: string): void {
    this.history.delete(roomId);
  }

  deleteAllHistory(): void {
    this.history.clear();
  }
}
