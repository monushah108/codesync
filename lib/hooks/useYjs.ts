"use client";

import { useMemo } from "react";
import * as Y from "yjs";
import { getAwareness } from "../awareness";
import { getYDoc, getYText } from "../yjs";
import { useYjsDocSync } from "./yjs/useYjsDocSync";
import { useYjsAwarenessSync } from "./yjs/useYjsAwarenessSync";

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

  // 1. Synchronize file document CRDT & DB state
  useYjsDocSync({ roomId, fileId, ydoc, yText });

  // 2. Synchronize collaborator awareness & live cursors
  useYjsAwarenessSync({ roomId, fileId, awareness });

  return {
    ydoc,
    yText,
    awareness,
  };
}

export default useYjs;
