"use client";

import { memo, useMemo, useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { WrapText } from "lucide-react";

import { getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { Button } from "@/components/ui/button";
import Emptypage from "./ui/Emptypage";
import TabBar from "./ui/TabBar";

interface CursorUser {
  name?: string;
  image?: string;
  color?: string;
}

interface CursorState {
  user?: CursorUser;
}

// How long a remote cursor can sit still before it's considered idle and
// gets dimmed. Re-checked on a timer since awareness only fires on change,
// so nothing else would notice someone has simply stopped moving.
const IDLE_TIMEOUT_MS = 4000;
const IDLE_CHECK_INTERVAL_MS = 1000;

function MonacoEditor({ roomId }: { roomId: string }) {
  const { activeFileId, openFiles } = useCodestore();
  const bindingRef = useRef<{
    destroy: () => void;
  } | null>(null);
  const [wordWrap, setWordWrap] = useState<"on" | "off">("off");

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

  function updateCursor(
    cursor: HTMLElement,
    state: CursorState,
    idle: boolean,
  ) {
    let container = cursor.querySelector(".cursor-name") as HTMLElement | null;

    if (!container) {
      container = document.createElement("div");
      container.className = "cursor-name";
      // Purely decorative — never let cursor badges capture clicks/hover,
      // whether from each other or from the code underneath them.
      container.style.pointerEvents = "none";

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

    // Idle users fade out and drop behind active ones, so an actively
    // moving cursor visually passes over/through an idle one instead of
    // disappearing beneath it when the two overlap.
    container.style.opacity = idle ? "0.35" : "1";
    container.style.transition = "opacity 200ms ease";
    cursor.style.zIndex = idle ? "1" : "20";
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

    // Per-client: the last cursor/selection signature we saw, and when it
    // last actually changed (as opposed to just re-sending the same state).
    const activity = new Map<
      number,
      { signature: string; lastActiveAt: number }
    >();

    const updateCursorLabels = () => {
      if (disposed) return;

      frame = null;

      const myId = awareness.clientID;
      const now = Date.now();

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

        const signature = JSON.stringify(
          (state as { selection?: unknown }).selection ?? null,
        );

        const previous = activity.get(clientId);

        if (!previous || previous.signature !== signature) {
          activity.set(clientId, { signature, lastActiveAt: now });
        }

        const lastActiveAt = activity.get(clientId)?.lastActiveAt ?? now;
        const idle = now - lastActiveAt > IDLE_TIMEOUT_MS;

        updateCursor(cursor, state, idle);
      });
    };

    const scheduleUpdate = () => {
      if (disposed || frame !== null) return;

      frame = requestAnimationFrame(updateCursorLabels);
    };

    awareness.on("change", scheduleUpdate);

    const contentDisposable = editor.onDidChangeModelContent(scheduleUpdate);

    // Nothing else re-triggers once a remote user simply stops moving, so
    // poll on an interval purely to re-evaluate idle/active state.
    const idleCheckInterval = window.setInterval(
      scheduleUpdate,
      IDLE_CHECK_INTERVAL_MS,
    );

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (disposed || !activeFileId) return;

      await useCodeActions.saveFile(roomId, activeFileId, yText.toString());
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () => {
      const next =
        editor.getOption(monaco.editor.EditorOption.wordWrap) === "on"
          ? "off"
          : "on";

      editor.updateOptions({
        wordWrap: next,
      });

      setWordWrap(next);
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

      window.clearInterval(idleCheckInterval);

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

      <div className="relative min-h-0 flex-1">
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
            lineNumbersMinChars: 3,
            glyphMargin: true,

            folding: true,
            foldingHighlight: true,
            showFoldingControls: "mouseover",

            /* ─────────────── WORD WRAP ─────────────── */

            wordWrap,
            wrappingIndent: "same",

            /* ─────────────── MINIMAP ─────────────── */

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
