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
import { useNotificationActions } from "@/lib/store/actions";
import { useLayoutstore } from "@/lib/store/Layoutstore";

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

    const handleConnect = () => {
      socket.emit("room:join", { roomId, user });
      useNotificationActions.connectionStateChanged("connected");
    };

    const handleDisconnect = () => {
      useNotificationActions.connectionStateChanged("disconnected");
    };

    if (socket.connected) {
      socket.emit("room:join", { roomId, user });
    } else {
      socket.connect();
    }

    const handleMembersWithSync = (members: any) => {
      handleMembers(members);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("room:members-refresh"));
      }
    };

    const handleActivityWithNotify = (activity: any) => {
      handleActivity(activity);
      const userId = user?.id || (user as any)?._id;
      if (activity.type === "join" && activity.userId !== userId) {
        useNotificationActions.memberJoined(
          activity.userName || "Collaborator",
          activity.userId,
          userId,
        );
      } else if (activity.type === "leave" && activity.userId !== userId) {
        useNotificationActions.memberLeft(
          activity.userName || "Collaborator",
          activity.userId,
          userId,
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("members", handleMembersWithSync);
    socket.on("activity", handleActivityWithNotify);
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

      const activeFile = store.openFiles.find((f) => f._id === fileId);
      if (activeFile) {
        useNotificationActions.fileSavedRemotely(activeFile.name);
      }
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
      const isSelf = user.id === targetUserId;
      if (isSelf) {
        useCodestore.getState().setRole(newRole);
      }
      useNotificationActions.memberRoleUpdated(memberName, newRole, isSelf);

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
      const isSelf = user.id === targetUserId;
      useNotificationActions.memberKickedOrBanned(memberName, reason, isSelf);

      if (isSelf) {
        // Disable all WorkspaceExitGuard interceptors before navigating
        // so the kicked/banned redirect is not blocked by the confirm modal
        useLayoutstore.getState().setForceNavigating(true);

        socket.emit("room:leave", { roomId, user });
        router.replace("/dashboard");
      } else {
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
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("members", handleMembersWithSync);
      socket.off("activity", handleActivityWithNotify);
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
