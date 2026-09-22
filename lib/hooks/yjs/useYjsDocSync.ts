"use client";

import { useEffect } from "react";
import * as Y from "yjs";
import { socket } from "@/lib/socket";
import { useCodestore } from "@/lib/store/Codestore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";

interface UseYjsDocSyncParams {
  roomId: string;
  fileId: string;
  ydoc: Y.Doc;
  yText: Y.Text;
}

export function useYjsDocSync({
  roomId,
  fileId,
  ydoc,
  yText,
}: UseYjsDocSyncParams) {
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

  // 2. When file content finishes loading, seed yText locally if empty and notify server
  useEffect(() => {
    if (!roomId || !fileId || !file?.loaded || !file?.content) return;

    // Immediately seed yText if empty so editor instantly shows file content
    if (yText.length === 0) {
      ydoc.transact(() => {
        if (yText.length === 0 && file.content) {
          yText.insert(0, file.content);
        }
      });
    }

    if (socket.connected) {
      socket.emit("yjs:init", {
        roomId,
        fileId,
        content: file.content,
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

  // 4. Socket events & Collaborative YDoc Sync
  useEffect(() => {
    if (!roomId || !fileId) return;

    // Initial sync response from server
    const handleSync = ({
      fileId: syncFileId,
      update,
    }: {
      roomId?: string;
      fileId?: string;
      update: number[];
    }) => {
      if (syncFileId && syncFileId !== fileId) return;

      if (update && update.length > 0) {
        Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
      }
    };

    socket.on("yjs:sync", handleSync);

    // Receive incremental remote updates from other collaborators
    const handleRemoteUpdate = ({
      fileId: updateFileId,
      update,
    }: {
      roomId?: string;
      fileId?: string;
      update: number[];
    }) => {
      if (updateFileId && updateFileId !== fileId) return;

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

    // Join file room on server & pass cached DB content to server if available
    const joinRoom = () => {
      const cached = useCodestore.getState().code[fileId];
      socket.emit("yjs:join", {
        roomId,
        fileId,
        content: cached?.content,
      });
    };

    joinRoom();
    socket.on("connect", joinRoom);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("yjs:sync", handleSync);
      socket.off("yjs:update", handleRemoteUpdate);
      socket.off("file:saved", handleFileSaved);

      ydoc.off("update", handleLocalUpdate);
    };
  }, [roomId, fileId, ydoc]);
}
