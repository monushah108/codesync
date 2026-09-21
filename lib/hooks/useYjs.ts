"use client";

import { useEffect, useMemo } from "react";
import * as Y from "yjs";

import {
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";

import { socket } from "@/lib/socket";
import { destroyAwareness, getAwareness } from "../awareness";
import { destroyYDoc, getYDoc, getYText } from "../yjs";
import { useCodestore } from "../store/Codestore";
import { useCodeActions } from "../store/actions/useCodeAction";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ec4899",
];

export function useYjs(roomId: string, fileId: string) {
  const isEnabled = Boolean(roomId && fileId);

  const ydoc = useMemo(
    () => (isEnabled ? getYDoc(roomId, fileId) : new Y.Doc()),
    [isEnabled, roomId, fileId],
  );

  const yText = useMemo(
    () => (isEnabled ? getYText(roomId, fileId) : ydoc.getText("editor")),
    [isEnabled, roomId, fileId, ydoc],
  );

  const awareness = useMemo(
    () => getAwareness(roomId, fileId || "__noop__"),
    [roomId, fileId],
  );

  const user = useCodestore((state) => state.user);
  const file = useCodestore((s) => s.code[fileId]);

  // 1. Ensure file is fetched into Zustand cache if not already present
  useEffect(() => {
    if (!roomId || !fileId) return;

    const store = useCodestore.getState();
    const cached = store.code[fileId];

    if (!cached?.loaded && !cached?.loading) {
      useCodeActions.loadFile(roomId, fileId);
    }
  }, [roomId, fileId]);

  // 2. Initialize yText from Zustand cache once file content arrives
  useEffect(() => {
    if (!roomId || !fileId || !file?.loaded) return;

    if (yText.length === 0 && file.content) {
      ydoc.transact(() => {
        if (yText.length === 0) {
          yText.insert(0, file.content);
        }
      });

      // Broadcast initial content to server and peers
      const initialUpdate = Y.encodeStateAsUpdate(ydoc);
      socket.emit("yjs:update", {
        roomId,
        fileId,
        update: Array.from(initialUpdate),
      });
    }
  }, [roomId, fileId, file?.loaded, file?.content, yText, ydoc]);

  // 3. Keep Zustand store synchronized with all yText changes (local & remote)
  useEffect(() => {
    if (!fileId) return;

    const handleYTextChange = () => {
      const current = yText.toString();
      const store = useCodestore.getState();
      const cached = store.code[fileId];

      if (cached?.content !== current) {
        store.updateContent(fileId, current);
        const saved = cached?.savedContent ?? "";
        store.setFileEdited(fileId, current !== saved);
      }
    };

    yText.observe(handleYTextChange);
    return () => {
      yText.unobserve(handleYTextChange);
    };
  }, [yText, fileId]);

  // 4. Update awareness user metadata
  useEffect(() => {
    if (!awareness || !user) return;

    awareness.setLocalStateField("user", {
      name: user.name || "Anonymous",
      image: user.image || null,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }, [awareness, user]);

  // 5. Socket events & Collaborative YDoc Sync
  useEffect(() => {
    if (!roomId || !fileId) return;

    // Initial sync from server
    const handleSync = ({ update }: { update: number[] }) => {
      if (update && update.length > 0) {
        Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
      }

      // If yText is still empty after remote sync, populate from Zustand cache
      const cached = useCodestore.getState().code[fileId];
      if (yText.length === 0 && cached?.content) {
        ydoc.transact(() => {
          if (yText.length === 0) {
            yText.insert(0, cached.content);
          }
        });

        const syncUpdate = Y.encodeStateAsUpdate(ydoc);
        socket.emit("yjs:update", {
          roomId,
          fileId,
          update: Array.from(syncUpdate),
        });
      }
    };

    socket.on("yjs:sync", handleSync);

    // Receive remote updates from other collaborators
    const handleRemoteUpdate = ({ update }: { update: number[] }) => {
      if (update && update.length > 0) {
        Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
      }
    };

    socket.on("yjs:update", handleRemoteUpdate);

    // Broadcast local updates
    const handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;

      socket.emit("yjs:update", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    ydoc.on("update", handleLocalUpdate);

    // Handle remote file saved events
    const handleFileSaved = ({
      fileId: savedFileId,
      content,
    }: {
      roomId: string;
      fileId: string;
      content: string;
    }) => {
      if (savedFileId !== fileId) return;

      const store = useCodestore.getState();
      store.setSavedFile(fileId, content);
    };

    socket.on("file:saved", handleFileSaved);

    // Receive remote awareness changes
    const handleAwareness = ({ update }: { update: number[] }) => {
      applyAwarenessUpdate(awareness, new Uint8Array(update), "remote");
    };

    socket.on("yjs:awareness", handleAwareness);

    // Broadcast local awareness changes
    const awarenessHandler = ({
      added,
      updated,
      removed,
    }: {
      added: number[];
      updated: number[];
      removed: number[];
    }) => {
      const changed = added.concat(updated).concat(removed);
      const update = encodeAwarenessUpdate(awareness, changed);

      socket.emit("yjs:awareness", {
        roomId,
        fileId,
        update: Array.from(update),
      });
    };

    awareness.on("update", awarenessHandler);

    // Join file room
    socket.emit("yjs:join", { roomId, fileId });

    return () => {
      awareness.setLocalState(null);
      socket.off("yjs:sync", handleSync);
      socket.off("yjs:update", handleRemoteUpdate);
      socket.off("yjs:awareness", handleAwareness);
      socket.off("file:saved", handleFileSaved);

      ydoc.off("update", handleLocalUpdate);
      awareness.off("update", awarenessHandler);

      destroyAwareness(roomId, fileId);
      destroyYDoc(roomId, fileId);
    };
  }, [roomId, fileId, ydoc, yText, awareness]);

  return {
    ydoc,
    yText,
    awareness,
  };
}
