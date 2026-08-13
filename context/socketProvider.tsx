"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";

import { SocketContextType } from "./types";
import { useCodestore } from "@/lib/store/Codestore";
import { socket } from "@/lib/socket";
import useFileEmitter, {
  handleActivity,
  handleError,
  handleExplorerOperation,
  handleMembers,
} from "@/lib/hooks/useExplorerSocket";
import useCreateAiEmitter, {
  handleAiResponse,
  handleMessages,
  handleTerminal,
} from "@/lib/hooks/useAiChatSocket";

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

    socket.connect();
    socket.emit("room:join", { roomId, user });
    socket.on("error", handleError);
    socket.on("members", handleMembers);
    socket.on("activity", handleActivity);
    socket.on("explorer:operation", handleExplorerOperation);
    socket.on("messages", handleMessages);
    socket.on("ai:token", handleAiResponse);
    socket.on("terminal", handleTerminal);

    return () => {
      socket.emit("room:leave", {
        roomId,
        user,
      });
      socket.off("error", handleError);
      socket.off("members", handleMembers);
      socket.off("activity", handleActivity);
      socket.off("explorer:operation", handleExplorerOperation);
      socket.off("messages", handleMessages);
      socket.off("ai:token", handleAiResponse);
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
