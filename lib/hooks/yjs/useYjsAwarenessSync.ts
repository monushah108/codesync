"use client";

import { useEffect } from "react";
import { Awareness } from "y-protocols/awareness";
import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import { socket } from "@/lib/socket";
import { useCodestore } from "@/lib/store/Codestore";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ec4899",
];

interface UseYjsAwarenessSyncParams {
  roomId: string;
  fileId: string;
  awareness: Awareness;
}

export function useYjsAwarenessSync({
  roomId,
  fileId,
  awareness,
}: UseYjsAwarenessSyncParams) {
  const user = useCodestore((state) => state.user);

  // 1. Update awareness local user metadata
  useEffect(() => {
    if (!awareness || !user) return;

    awareness.setLocalStateField("user", {
      name: user.name || "Anonymous",
      image: user.image || null,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }, [awareness, user]);

  // 2. Manage awareness socket exchange
  useEffect(() => {
    if (!roomId || !fileId || !awareness) return;

    const broadcastLocalAwareness = () => {
      const state = awareness.getLocalState();
      if (!state) return;
      const update = encodeAwarenessUpdate(awareness, [awareness.clientID]);
      socket.emit("yjs:awareness", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    // Receive remote awareness changes
    const handleAwareness = ({
      fileId: awarenessFileId,
      update,
    }: {
      roomId?: string;
      fileId?: string;
      update: number[];
    }) => {
      if (awarenessFileId && awarenessFileId !== fileId) return;

      applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
    };

    socket.on("yjs:awareness", handleAwareness);

    // Respond to awareness requests from server when another user joins this file
    const handleAwarenessRequest = ({
      fileId: reqFileId,
    }: {
      roomId?: string;
      fileId?: string;
    }) => {
      if (reqFileId && reqFileId !== fileId) return;
      broadcastLocalAwareness();
    };

    socket.on("yjs:awareness:request", handleAwarenessRequest);

    // Broadcast local awareness changes (ignore remote updates to prevent echo loops)
    const awarenessHandler = (
      {
        added,
        updated,
        removed,
      }: {
        added: number[];
        updated: number[];
        removed: number[];
      },
      origin: unknown,
    ) => {
      if (origin === "remote") return;

      const changed = added.concat(updated).concat(removed);
      if (changed.length === 0) return;

      const update = encodeAwarenessUpdate(awareness, changed);

      socket.emit("yjs:awareness", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    awareness.on("update", awarenessHandler);

    // Send initial local cursor to room members
    const initialTimer = setTimeout(broadcastLocalAwareness, 150);

    return () => {
      clearTimeout(initialTimer);

      // Clear cursor position for this file when switching away
      awareness.setLocalState(null);

      socket.off("yjs:awareness", handleAwareness);
      socket.off("yjs:awareness:request", handleAwarenessRequest);
      awareness.off("update", awarenessHandler);
    };
  }, [roomId, fileId, awareness]);
}
