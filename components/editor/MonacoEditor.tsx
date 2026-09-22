"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { ChevronRight, WrapText, Lock } from "lucide-react";
import { Icon } from "@iconify/react";

import { getFileIcon, getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { Button } from "@/components/ui/button";
import { useLayoutstore } from "@/lib/store/Layoutstore";
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


const IDLE_TIMEOUT_MS = 4000;
const IDLE_CHECK_INTERVAL_MS = 1000;

function MonacoEditor({ roomId }: { roomId: string }) {
  const isMobile = useIsMobile();
  const { activeFileId, openFiles, role } = useCodestore();
  const isViewer = role === "viewer";
  const bindingRef = useRef<{
    destroy: () => void;
  } | null>(null);
  const undoManagerRef = useRef<Y.UndoManager | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [wordWrap, setWordWrap] = useState<"on" | "off">("off");

  useEffect(() => {
    if (isMobile) {
      setWordWrap("on");
    }
  }, [isMobile]);

  // Robust layout synchronization using ResizeObserver on the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (!containerRef.current || !editorRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        editorRef.current.layout({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    const ro = new ResizeObserver(() => {
      updateSize();
    });

    ro.observe(el);

    // Also trigger on orientationchange or window resize as safety
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);

    updateSize();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

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
    return <Emptypage roomId={roomId} />;
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
    editorRef.current = editor;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        editor.layout({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    }

    // Force layout after DOM paint as well
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          editor.layout({
            width: Math.floor(rect.width),
            height: Math.floor(rect.height),
          });
          return;
        }
      }
      editor.layout();
    });

    const model = editor.getModel();

    if (!model) return;

    // Define authentic VS Code Dark+ theme
    monaco.editor.defineTheme("vscode-dark-custom", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "keyword", foreground: "569CD6" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
        { token: "variable", foreground: "9CDCFE" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
        "editorCursor.foreground": "#aeafad",
        "editor.lineHighlightBackground": "#282828",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
      },
    });
    monaco.editor.setTheme("vscode-dark-custom");

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

    if (undoManagerRef.current) {
      try {
        undoManagerRef.current.destroy();
      } catch (error) {
        console.warn("Previous UndoManager cleanup:", error);
      }

      undoManagerRef.current = null;
    }

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      awareness,
    );

    bindingRef.current = binding;

    const undoManager = new Y.UndoManager(yText, {
      trackedOrigins: new Set([binding, null]),
    });

    undoManagerRef.current = undoManager;

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

    /* ─────────────── KEYBINDINGS & COMMANDS ─────────────── */

    if (!isViewer) {
      // Ctrl+Z (Undo)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
        if (disposed) return;
        undoManager.undo();
      });

      // Ctrl+Shift+Z / Ctrl+Y (Redo)
      editor.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
        () => {
          if (disposed) return;
          undoManager.redo();
        },
      );

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
        if (disposed) return;
        undoManager.redo();
      });

      // Register in Monaco Command Palette / Context Menu
      editor.addAction({
        id: "collaborative-undo",
        label: "Undo",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ],
        run: () => {
          if (!disposed) undoManager.undo();
        },
      });

      editor.addAction({
        id: "collaborative-redo",
        label: "Redo",
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY,
        ],
        run: () => {
          if (!disposed) undoManager.redo();
        },
      });

      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
        if (disposed || !activeFileId) return;

        await useCodeActions.saveFile(roomId, activeFileId, yText.toString());
      });
    }

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

    // If file was opened from "Find in File", trigger Monaco's find widget
    const pendingAction = useLayoutstore.getState().pendingEditorAction;
    if (pendingAction === "find") {
      useLayoutstore.getState().setPendingEditorAction(null);
      setTimeout(() => {
        try {
          editor.trigger("quickopen", "actions.find", null);
          editor.focus();
        } catch (e) {
          console.warn("Trigger find in editor:", e);
        }
      }, 150);
    }

    // Touch & click handler to ensure focus and trigger mobile virtual keyboard
    const domNode = editor.getDomNode();
    const handleTapFocus = () => {
      if (!editor.hasTextFocus()) {
        editor.focus();
      }
      const textarea = domNode?.querySelector("textarea.inputarea") as HTMLTextAreaElement | null;
      if (textarea && document.activeElement !== textarea) {
        textarea.focus();
      }
    };

    if (domNode) {
      domNode.addEventListener("touchstart", handleTapFocus, { passive: true });
      domNode.addEventListener("click", handleTapFocus);
    }

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

      if (domNode) {
        domNode.removeEventListener("touchstart", handleTapFocus);
        domNode.removeEventListener("click", handleTapFocus);
      }

      if (editorRef.current === editor) {
        editorRef.current = null;
      }

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }

      window.clearInterval(idleCheckInterval);

      contentDisposable.dispose();

      if (undoManagerRef.current === undoManager) {
        undoManager.destroy();
        undoManagerRef.current = null;
      }

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
    <div className="flex h-full min-h-0 w-full flex-col bg-[#1e1e1e] overflow-hidden">
      <TabBar roomId={roomId} />

      {/* VS Code Breadcrumb Bar */}
      {activeFile && (
        <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1e1e1e] px-3 text-[11px] text-[#858585] select-none">
          <span className="hover:text-[#cccccc] cursor-pointer">workspace</span>
          <ChevronRight className="w-3 h-3 text-[#5a5a5a]" />
          <span className="flex items-center gap-1 text-[#cccccc] font-medium">
            <Icon icon={getFileIcon(activeFile.name)} width={13} height={13} className="shrink-0" />
            <span>{activeFile.name}</span>
          </span>

          {isViewer && (
            <span className="ml-auto flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 text-[10px] font-medium text-amber-400">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>View Only</span>
            </span>
          )}
        </div>
      )}

      {/* Robust container ensuring non-zero pixel height on mobile flex layouts */}
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 w-full h-full overflow-hidden"
      >
        <div className="absolute inset-0 h-full w-full">
          <Editor
            key={activeFileId}
            height="100%"
            width="100%"
            className="!h-full !w-full"
            wrapperProps={{ style: { height: "100%", width: "100%" } }}
            theme="vscode-dark-custom"
            defaultLanguage={getType(activeFile?.name ?? "")?.language}
            onMount={handleMount}
            options={{
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              cursorStyle: "line",
              cursorWidth: 2,

              fontSize: isMobile ? 13 : 13.5,
              lineHeight: isMobile ? 19 : 20,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
              fontLigatures: true,

              automaticLayout: true,
              smoothScrolling: true,
              scrollBeyondLastLine: false,

              lineNumbers: "on",
              lineNumbersMinChars: isMobile ? 2 : 3,
              glyphMargin: !isMobile,
              renderLineHighlight: "all",
              renderWhitespace: "selection",

              fixedOverflowWidgets: true,
              domReadOnly: isViewer,
              readOnly: isViewer,

              bracketPairColorization: {
                enabled: true,
              },
              guides: {
                bracketPairs: true,
                indentation: true,
                highlightActiveIndentation: true,
              },

              folding: !isMobile,
              foldingHighlight: !isMobile,
              showFoldingControls: isMobile ? "never" : "mouseover",

              padding: { top: isMobile ? 4 : 6, bottom: isMobile ? 4 : 6 },
              tabSize: 2,

              /* ─────────────── WORD WRAP ─────────────── */
              wordWrap,
              wrappingIndent: "same",

              /* ─────────────── MINIMAP ─────────────── */
              minimap: {
                enabled: !isMobile,
                maxColumn: 80,
                renderCharacters: false,
                showSlider: "mouseover",
              },

              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
                verticalScrollbarSize: isMobile ? 6 : 10,
                horizontalScrollbarSize: isMobile ? 6 : 10,
                useShadows: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(MonacoEditor);
