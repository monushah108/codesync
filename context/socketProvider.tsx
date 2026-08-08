"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { socket } from "../socket";
import { useCodestore } from "../store/Codestore";
import useCreateAiEmitter, {
  handleAiMessages,
  handleTerminal,
} from "../hooks/useAiChatSocket";
import useFileEmitter, {
  handleActivity,
  handleExplorerOperation,
  handleMembers,
} from "../hooks/useExplorerSocket";
import { SocketContextType } from "./types";

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  const user = useCodestore((state) => state.user);
  useEffect(() => {
    if (!roomId || !user) return;

    socket.emit("explorer:join", { roomId, user });

    socket.on("members", handleMembers);
    socket.on("activity", handleActivity);
    socket.on("explorer:operation", handleExplorerOperation);
    socket.on("messages", handleAiMessages);
    socket.on("terminal", handleTerminal);

    return () => {
      socket.emit("explorer:leave", {
        roomId,
        user,
      });
      socket.off("members", handleMembers);
      socket.off("activity", handleActivity);
      socket.off("explorer:operation", handleExplorerOperation);
      socket.off("messages", handleAiMessages);
      socket.off("terminal", handleTerminal);
    };
  }, [roomId, user]);

  const chat = useCreateAiEmitter({ roomId, user });
  const file = useFileEmitter({ roomId, user });

  const value = useMemo(() => {
    return { ...chat, ...file };
  }, [chat, file]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export default function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
}
