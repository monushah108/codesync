"use client";

import { memo, useMemo, useRef } from "react";
import { Editor, OnMount } from "@monaco-editor/react";

import TabBar from "./ui/TabBar";

import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import Emptypage from "./ui/Emptypage";

interface CursorUser {
  name?: string;
  image?: string;
  color?: string;
}

interface CursorState {
  user?: CursorUser;
}

function MonacoEditor({ roomId }: { roomId: string }) {
  const { activeFileId, openFiles } = useCodestore();
  const bindingRef = useRef<{
    destroy: () => void;
  } | null>(null);
  const activeFile = useMemo(
    () => openFiles.find((file) => file._id === activeFileId),
    [openFiles, activeFileId],
  );

  /*
   * The hook should internally handle the case where activeFileId
   * is missing / invalid.
   */
  const { yText, awareness } = useYjs(roomId, activeFileId ?? "");

  if (!activeFileId) {
    return <Emptypage />;
  }

  function updateCursor(cursor: HTMLElement, state: CursorState) {
    let container = cursor.querySelector(".cursor-name") as HTMLElement | null;

    if (!container) {
      container = document.createElement("div");
      container.className = "cursor-name";

      const badge = document.createElement("div");
      badge.className = "cursor-badge";

      const avatar = document.createElement("img");
      avatar.className = "cursor-avatar";

      const text = document.createElement("span");
      text.className = "cursor-text";

      const arrow = document.createElement("div");
      arrow.className = "cursor-arrow";

      badge.appendChild(avatar);
      badge.appendChild(text);
      badge.appendChild(arrow);

      container.appendChild(badge);
      cursor.appendChild(container);
    }

    const badge = container.querySelector(".cursor-badge") as HTMLElement;

    const avatar = container.querySelector(
      ".cursor-avatar",
    ) as HTMLImageElement;

    const text = container.querySelector(".cursor-text") as HTMLElement;

    const name = state.user?.name ?? "Anonymous";
    const image = state.user?.image ?? "";
    const color = state.user?.color ?? "#3b82f6";

    badge.style.backgroundColor = color;

    avatar.src = image;
    avatar.alt = name;

    text.textContent = name;
  }

  const handleMount: OnMount = async (editor, monaco) => {
    const model = editor.getModel();

    if (!model) return;

    const { MonacoBinding } = await import("y-monaco");

    // Destroy any previous binding before creating another one
    if (bindingRef.current) {
      try {
        bindingRef.current.destroy();
      } catch (error) {
        console.warn("Previous Monaco binding cleanup:", error);
      }

      bindingRef.current = null;
    }

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      awareness,
    );

    bindingRef.current = binding;

    let disposed = false;
    let frame: number | null = null;

    const updateCursorLabels = () => {
      if (disposed) return;

      frame = null;

      const myId = awareness.clientID;

      awareness.getStates().forEach((state, clientId) => {
        const cursor = document.querySelector(
          `.yRemoteSelectionHead-${clientId}`,
        ) as HTMLElement | null;

        if (!cursor) return;

        if (clientId === myId) {
          cursor.style.display = "none";
          return;
        }

        cursor.style.display = "";
        cursor.style.backgroundColor = state.user?.color ?? "#3b82f6";

        updateCursor(cursor, state);
      });
    };

    const scheduleUpdate = () => {
      if (disposed || frame !== null) return;

      frame = requestAnimationFrame(updateCursorLabels);
    };

    awareness.on("change", scheduleUpdate);

    const contentDisposable = editor.onDidChangeModelContent(scheduleUpdate);

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (disposed || !activeFileId) return;

      await useCodeActions.saveFile(roomId, activeFileId, yText.toString());
    });

    scheduleUpdate();

    /*
     * IMPORTANT:
     *
     * Don't call binding.destroy() here.
     *
     * Monaco's editor disposal + y-monaco can otherwise
     * cause the same YJS listeners to be removed twice.
     */

    editor.onDidDispose(() => {
      if (disposed) return;

      disposed = true;

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      contentDisposable.dispose();

      /*
       * Do NOT:
       *
       * awareness.off(...)
       * binding.destroy()
       *
       * here.
       */

      if (bindingRef.current === binding) {
        bindingRef.current = null;
      }
    });
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <TabBar roomId={roomId} />

      <div className="min-h-0 flex-1">
        <Editor
          key={activeFileId}
          height="100%"
          theme="vs-dark"
          defaultLanguage={getType(activeFile?.name ?? "")?.language}
          onMount={handleMount}
          options={{
            cursorBlinking: "smooth",
            cursorStyle: "line",

            fontSize: 14,
            fontFamily: "Fira Code, monospace",

            automaticLayout: true,
            smoothScrolling: true,
            scrollBeyondLastLine: false,

            lineNumbers: "on",

            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
}

export default memo(MonacoEditor);
