import { useCallback } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { MessagesEvent, TerminalEvent } from "../../context/types";
import { User } from "../store/types/codeTypes";

export const handleMessages = ({ user, payload }: MessagesEvent) => {
  const store = useCodestore.getState();
  const { prompt } = payload;

  // Normal/user message
  store.addMessage({
    id: crypto.randomUUID(),
    role: "user",
    user: user?.name,
    image: user?.image,
    content: prompt,
    createdAt: new Date().toISOString(),
  });
};

export const handleAiResponse = (content: string) => {
  useCodestore.getState().addBotMessage(content);
  useCodestore.getState().setGenerating(false);
};

export const handleTerminal = ({ data, action }: TerminalEvent) => {
  const terminal = useCodestore.getState();
  console.log(data, action);
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
        socket.emit("ai:chat", {
          roomId,
          user,
          message: prompt,
        });

        socket.on("ai:loading", (IsLoading) => {
          useCodestore.getState().setGenerating(IsLoading);
        });

        socket.on("ai:error", (err) => {
          useCodestore.getState().setGeneratedError(err);
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
