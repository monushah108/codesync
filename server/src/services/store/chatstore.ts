type ChatMessage =
  | {
      id: string;
      type: "ai" | "chat";
      content: string;
      role: "user";
      userId: string;
      userName: string;
      createdAt: number;
    }
  | {
      id: string;
      type: "ai" | "chat";
      content: string;
      role: "assistant";
      createdAt: number;
    };

export class ChatStore {
  private history = new Map<string, ChatMessage[]>();

  getHistory(roomId: string, type?: "ai" | "chat"): ChatMessage[] {
    const messages = this.history.get(roomId) ?? [];

    if (!type) {
      return messages;
    }

    return messages.filter((message) => message.type === type);
  }

  setHistory(
    roomId: string,
    content: string,
    type: "ai" | "chat",
    role: "user",
    userId: string,
    userName: string,
  ): ChatMessage;

  setHistory(
    roomId: string,
    content: string,
    type: "ai" | "chat",
    role: "assistant",
  ): ChatMessage;

  setHistory(
    roomId: string,
    content: string,
    type: "ai" | "chat",
    role: "user" | "assistant",
    userId?: string,
    userName?: string,
  ): ChatMessage {
    const message =
      role === "user"
        ? {
            id: crypto.randomUUID(),
            type,
            content,
            role,
            userId: userId!,
            userName: userName!,
            createdAt: Date.now(),
          }
        : {
            id: crypto.randomUUID(),
            type,
            content,
            role,
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
