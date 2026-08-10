import { useCallback } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { AiMessage, MessagesEvent, TerminalEvent } from "../../context/types";

export const handleAiMessages = ({ user, payload }: MessagesEvent) => {
  const store = useCodestore.getState();
  const { content, prompt } = payload;

  store.addMessage({
    id: crypto.randomUUID(),
    role: "user",
    user: user?.name,
    image: user?.image,
    content: prompt,
  });

  store.addMessage({
    id: crypto.randomUUID(),
    role: "assistant",
    content,
  });
};

export const handleTerminal = ({ data, action }: TerminalEvent) => {
  const terminal = useCodestore.getState();

  switch (action) {
    case "clear":
      terminal.clearOutputs();
      break;

    case "run code":
      terminal.addOutput(data.at(-1));
      break;

    case "help":
      terminal.addOutput(data.at(-1));
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
    (payload: AiMessage) => {
      if (!roomId || !user) return;

      socket.emit("messages", {
        roomId,
        user,
        payload,
      });
    },
    [roomId, user],
  );

  const applyOutput = useCallback(
    (output, action) => {
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
    applyOutput,
    applyResponse,
  };
}
