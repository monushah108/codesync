import { useCallback } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import { MessagesEvent, TerminalEvent } from "../../context/types";
import { CodeOutput, User } from "../store/types/codeTypes";

import { useAiEditStore } from "../store/useAiEditStore";

export const handleMessages = ({ user, payload }: MessagesEvent) => {
  const store = useCodestore.getState();
  const { prompt } = payload;

  // Normal/user message
  store.addMessage({
    id: crypto.randomUUID(),
    role: "user",
    name: user.name,
    image: user.image,
    content: prompt ?? "no response",
    createdAt: new Date().toISOString(),
  });
};

export const handleAiResponse = (content: string) => {
  useCodestore.getState().addBotMessage(content);
  useCodestore.getState().setGenerating(false);
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
        terminal.addOutput(data.at(-1)!);
      }
      break;

    default:
      terminal.addOutput({
        id: crypto.randomUUID(),
        stderr: `Command not found: ${action}`,
      });
  }
};

export const handleClearMsg = () => {
  useCodestore.getState().setClearResponse();
};

export default function useCreateAiEmitter({
  roomId,
  user,
}: {
  roomId: string;
  user: User | null;
}) {
  const applyResponse = useCallback(
    (prompt: string, editActiveFile: boolean = false) => {
      if (!roomId || !user || !prompt.trim()) {
        return;
      }

      // Broadcast user message to chat room
      socket.emit("messages", {
        roomId,
        user,
        payload: {
          prompt,
        },
      });

      const activeFile = useCodestore
        .getState()
        .openFiles.find((f) => f._id === useCodestore.getState().activeFileId);

      // If an active file is open and user asked to edit/code, trigger real-time editor edit!
      if (editActiveFile && activeFile) {
        useCodestore.getState().addMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          name: "Antigravity AI",
          content: `🤖 **Antigravity AI** is editing \`${activeFile.name}\` in real time with live cursor awareness.\n\nUse the **Stop (Esc)**, **Accept (Ctrl+↵)**, or **Reject (Esc)** controls directly on the code editor.`,
          createdAt: new Date().toISOString(),
        });

        useAiEditStore.getState().triggerEdit(prompt, "edit");
        return;
      }

      const isExplicitMention = /(^|\s)@bot\b/i.test(prompt);
      // Trigger AI if @bot is mentioned or if it's not mentioning another user
      const shouldTriggerAi = isExplicitMention || !/(^|\s)@(?!bot\b)\w+/i.test(prompt);

      if (shouldTriggerAi) {
        socket.emit("ai:chat", {
          roomId,
          user,
          message: prompt,
          fileId: useCodestore.getState().activeFileId,
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

  const stopAi = useCallback(() => {
    if (!roomId) return;
    socket.emit("ai:stop", { roomId });
    useCodestore.getState().setGenerating(false);
  }, [roomId]);

  const applyOutput = useCallback(
    (output: CodeOutput[], action: string) => {
      if (!roomId) return;

      socket.emit("terminal", {
        roomId,
        data: output,
        action,
      });
    },
    [roomId],
  );

  const clearMessage = useCallback(() => {
    if (!roomId) return;

    socket.emit("clear:msg", {
      roomId,
    });
  }, [roomId]);

  return {
    applyResponse,
    applyOutput,
    clearMessage,
    stopAi,
  };
}
