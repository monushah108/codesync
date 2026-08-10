import { useCallback } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { AiMessage, TerminalEvent, User } from "../../context/types";

export const handleAiMessages = ({ user, payload }: MessagesEvent) => {
  const store = useCodestore.getState();
  const { content, prompt } = payload;

  // Normal/user message
  store.addMessage({
    id: crypto.randomUUID(),
    role: "user",
    user: user?.name,
    image: user?.image,
    content: prompt,
    createdAt: new Date().toISOString(),
  });

  // Only add AI response when one exists
  if (content) {
    store.addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content,
    });
  }
};

export const handleTerminal = ({ data, action }: TerminalEvent) => {
  const terminal = useCodestore.getState();

  switch (action) {
    case "clear":
      terminal.clearOutputs();
      break;

    case "run code":
    case "help":
      if (data.length > 0) {
        terminal.addOutput(data.at(-1));
      }
      break;

    default:
      terminal.addOutput({
        id: crypto.randomUUID(),
        stderr: `Command not found: ${action}`,
      });
  }
};

export default function useCreateAiEmitter({
  roomId,
  user,
}: {
  roomId: string;
  user: User;
}) {
  const applyResponse = useCallback(
    (prompt: string) => {
      if (!roomId || !user || !prompt.trim()) {
        return;
      }

      const isBotMentioned = /(^|\s)@bot\b/i.test(prompt);

      /*
       * ALWAYS send the message first.
       *
       * This handles:
       * normal chat
       * @bot chat
       */
      socket.emit("messages", {
        roomId,
        user,
        payload: {
          prompt,
        },
      });

      /*
       * Only trigger AI when @bot is mentioned.
       */
      if (isBotMentioned) {
        const { loading } = useCodestore.getState().response;

        if (loading) {
          return;
        }

        console.log('ai initated' , loading)

        socket.emit("ai:chat", {
          roomId,
          user,
          message: prompt,
        });
      }
    },
    [roomId, user],
  );

  const applyOutput = useCallback(
    (output: unknown[], action: string) => {
      if (!roomId) return;

      socket.emit("terminal", {
        roomId,
        data: output,
        action,
      });
    },
    [roomId],
  );

  return {
    applyResponse,
    applyOutput,
  };
}
