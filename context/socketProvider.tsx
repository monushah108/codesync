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
  handleClearMsg,
  handleMessages,
  handleTerminal,
} from "@/lib/hooks/useAiChatSocket";

import { useRouter } from "next/navigation";
import { notify } from "@/lib/store/Notificationstore";

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
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
    socket.on("msg:cleared", handleClearMsg);

    const handleGlobalFileSaved = ({
      fileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content: string;
    }) => {
      const store = useCodestore.getState();
      store.setSavedFile(fileId, content);
      store.setFileEdited(fileId, false);
    };

    const handleMemberRoleUpdated = ({
      targetUserId,
      newRole,
      memberName,
    }: {
      targetUserId: string;
      newRole: "owner" | "editor" | "viewer";
      memberName: string;
    }) => {
      if (user.id === targetUserId) {
        useCodestore.getState().setRole(newRole);
        notify.info(
          "Role Updated",
          `Your role in this room has been changed to "${newRole}" by the room owner.`,
          "Room Access",
        );
      } else {
        notify.info(
          "Collaborator Updated",
          `${memberName}'s role was changed to "${newRole}".`,
          "Collaborators",
        );
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("room:members-refresh"));
      }
    };

    const handleMemberKicked = ({
      targetUserId,
      reason,
      memberName,
    }: {
      targetUserId: string;
      reason: "banned" | "removed";
      memberName: string;
    }) => {
      if (user.id === targetUserId) {
        if (reason === "banned") {
          notify.error(
            "Banned from Room",
            "You have been banned from this room by the owner.",
            "Access Denied",
          );
        } else {
          notify.warning(
            "Removed from Room",
            "You have been removed from this room by the owner.",
            "Room Access",
          );
        }
        socket.emit("room:leave", { roomId, user });
        router.replace("/dashboard");
      } else {
        notify.warning(
          reason === "banned" ? "Member Banned" : "Member Removed",
          `${memberName} was ${reason} by the owner.`,
          "Collaborators",
        );
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("room:members-refresh"));
        }
      }
    };

    socket.on("file:saved", handleGlobalFileSaved);
    socket.on("member:role-updated", handleMemberRoleUpdated);
    socket.on("member:kicked", handleMemberKicked);

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
      socket.off("msg:cleared", handleClearMsg);
      socket.off("file:saved", handleGlobalFileSaved);
      socket.off("member:role-updated", handleMemberRoleUpdated);
      socket.off("member:kicked", handleMemberKicked);
    };
  }, [roomId, user, router]);

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
