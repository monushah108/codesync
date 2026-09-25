"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Editor, BeforeMount, OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { ChevronRight, Lock } from "lucide-react";
import { Icon } from "@iconify/react";

import { getFileIcon, getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import { downloadFile } from "@/lib/api/explorerApi";
import { toast } from "sonner";
import Emptypage from "./ui/Emptypage";
import TabBar from "./ui/TabBar";

const IDLE_TIMEOUT_MS = 4000;
const IDLE_CHECK_INTERVAL_MS = 1000;
const VSCODE_DARK_CUSTOM_THEME = "vscode-dark-custom";

// Define authentic VS Code Dark+ theme
function defineVsCodeTheme(monaco: any) {
  monaco.editor.defineTheme(VSCODE_DARK_CUSTOM_THEME, {
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
}

// Dynamically generate pure CSS styles for remote cursors and selection ranges
function updateRemoteCursorStyles(
  awareness: any,
  activityMap: Map<number, { signature: string; lastActiveAt: number }>,
) {
  if (typeof document === "undefined" || !awareness) return;

  let styleEl = document.getElementById("yjs-cursor-styles") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "yjs-cursor-styles";
    document.head.appendChild(styleEl);
  }

  const myId = awareness.clientID;
  const now = Date.now();
  let css = "";

  awareness.getStates().forEach((state: any, clientId: number) => {
    if (clientId === myId) return;

    const user = state.user;
    const color = user?.color || "#3b82f6";
    const name = user?.name || "Collaborator";

    // Track cursor activity for idle detection
    const signature = JSON.stringify(state.selection ?? null);
    const prev = activityMap.get(clientId);

    if (!prev || prev.signature !== signature) {
      activityMap.set(clientId, { signature, lastActiveAt: now });
    }

    const lastActiveAt = activityMap.get(clientId)?.lastActiveAt ?? now;
    const isIdle = now - lastActiveAt > IDLE_TIMEOUT_MS;
    const opacity = isIdle ? "0.35" : "1";
    const zIndex = isIdle ? "10" : "100";

    const safeName = name.replace(/["\\]/g, "");

    css += `
.yRemoteSelection-${clientId} {
  background-color: ${color}33 !important;
}
.yRemoteSelectionHead-${clientId} {
  position: absolute !important;
  border-left: 2px solid ${color} !important;
  height: 100% !important;
  box-sizing: border-box !important;
  opacity: ${opacity} !important;
  transition: opacity 200ms ease !important;
  z-index: ${zIndex} !important;
  pointer-events: none !important;
}
.yRemoteSelectionHead-${clientId}::after {
  content: "${safeName}" !important;
  position: absolute !important;
  top: -19px !important;
  left: -2px !important;
  font-size: 10px !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  font-weight: 500 !important;
  background-color: ${color} !important;
  color: #ffffff !important;
  padding: 1px 5px !important;
  border-radius: 3px !important;
  white-space: nowrap !important;
  pointer-events: none !important;
  line-height: normal !important;
  z-index: ${zIndex} !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
  opacity: ${opacity} !important;
  transition: opacity 200ms ease !important;
}
`;
  });

  styleEl.textContent = css;
}

function clearRemoteCursorStyles() {
  if (typeof document === "undefined") return;
  const styleEl = document.getElementById("yjs-cursor-styles");
  if (styleEl) {
    styleEl.textContent = "";
  }
}

let MonacoBindingClass: any = null;
async function getMonacoBinding() {
  if (!MonacoBindingClass) {
    const mod = await import("y-monaco");
    MonacoBindingClass = mod.MonacoBinding;
  }
  return MonacoBindingClass;
}

// Register undo/redo, save, and word-wrap keybindings
function registerEditorKeybindings({
  editor,
  monaco,
  undoManager,
  roomId,
  activeFileId,
  yText,
  setWordWrap,
  isViewer,
  isDisposed,
}: {
  editor: any;
  monaco: any;
  undoManager: Y.UndoManager;
  roomId: string;
  activeFileId: string | null;
  yText: Y.Text;
  setWordWrap: React.Dispatch<React.SetStateAction<"on" | "off">>;
  isViewer: boolean;
  isDisposed: () => boolean;
}) {
  if (!isViewer) {
    // Ctrl+Z (Undo)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      if (isDisposed()) return;
      undoManager.undo();
    });

    // Ctrl+Shift+Z / Ctrl+Y (Redo)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
      () => {
        if (isDisposed()) return;
        undoManager.redo();
      },
    );

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      if (isDisposed()) return;
      undoManager.redo();
    });

    // Register in Monaco Command Palette / Context Menu
    editor.addAction({
      id: "collaborative-undo",
      label: "Undo",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ],
      run: () => {
        if (!isDisposed()) undoManager.undo();
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
        if (!isDisposed()) undoManager.redo();
      },
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (isDisposed() || !activeFileId) return;
      await useCodeActions.saveFile(roomId, activeFileId, yText.toString());
    });
  }

  // Download File: Ctrl+Alt+S / Cmd+Alt+S and Monaco Context Menu action
  editor.addAction({
    id: "download-active-file",
    label: "Download File",
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyS,
    ],
    contextMenuGroupId: "9_cutcopypaste",
    contextMenuOrder: 4,
    run: async () => {
      if (isDisposed() || !activeFileId) return;
      const file = useCodestore
        .getState()
        .openFiles.find((f) => f._id === activeFileId);
      if (!file) return;

      const toastId = toast.loading(`Preparing ${file.name}...`);
      try {
        await downloadFile(roomId, file._id, file.name, yText.toString());
        toast.success(`Downloaded ${file.name}!`, { id: toastId });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to download file";
        toast.error(message, { id: toastId });
      }
    },
  });

  // Toggle word wrap: Alt+Z
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () => {
    const next =
      editor.getOption(monaco.editor.EditorOption.wordWrap) === "on"
        ? "off"
        : "on";
    editor.updateOptions({ wordWrap: next });
    setWordWrap(next);
  });

  // Toggle Preview: Ctrl+Shift+V or Cmd+Shift+V
  editor.addAction({
    id: "toggle-editor-preview",
    label: "Toggle Preview",
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV,
    ],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    run: () => {
      if (!isDisposed()) {
        useLayoutstore.getState().togglePanel("preview");
      }
    },
  });
}

function MonacoEditor({ roomId }: { roomId: string }) {
  const isMobile = useIsMobile();
  const { activeFileId, openFiles, role } = useCodestore();
  const isViewer = role === "viewer";
  const bindingRef = useRef<{ destroy: () => void } | null>(null);
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

  const { yText, awareness } = useYjs(roomId, activeFileId ?? "");

  if (!activeFileId) {
    return <Emptypage roomId={roomId} />;
  }

  const handleBeforeMount: BeforeMount = (monaco) => {
    defineVsCodeTheme(monaco);
  };

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

    const model = editor.getModel();
    if (!model) return;

    monaco.editor.setTheme(VSCODE_DARK_CUSTOM_THEME);

    const MonacoBinding = await getMonacoBinding();

    // Clean up any stale binding or undo manager
    if (bindingRef.current) {
      try {
        bindingRef.current.destroy();
      } catch (e) {
        console.warn("Binding cleanup:", e);
      }
      bindingRef.current = null;
    }

    if (undoManagerRef.current) {
      try {
        undoManagerRef.current.destroy();
      } catch (e) {
        console.warn("UndoManager cleanup:", e);
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
    const isDisposed = () => disposed;
    const activityMap = new Map<number, { signature: string; lastActiveAt: number }>();

    // Dynamic CSS live cursor updater
    const syncCursors = () => {
      if (disposed) return;
      updateRemoteCursorStyles(awareness, activityMap);
    };

    awareness.on("change", syncCursors);

    // Periodic idle check
    const idleInterval = window.setInterval(syncCursors, IDLE_CHECK_INTERVAL_MS);

    // Initial render of remote cursors
    syncCursors();

    // Register Keybindings
    registerEditorKeybindings({
      editor,
      monaco,
      undoManager,
      roomId,
      activeFileId,
      yText,
      setWordWrap,
      isViewer,
      isDisposed,
    });

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

    editor.onDidDispose(() => {
      if (disposed) return;
      disposed = true;

      window.clearInterval(idleInterval);
      awareness.off("change", syncCursors);
      clearRemoteCursorStyles();

      if (domNode) {
        domNode.removeEventListener("touchstart", handleTapFocus);
        domNode.removeEventListener("click", handleTapFocus);
      }

      if (editorRef.current === editor) {
        editorRef.current = null;
      }

      if (undoManagerRef.current === undoManager) {
        undoManager.destroy();
        undoManagerRef.current = null;
      }

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
            theme={VSCODE_DARK_CUSTOM_THEME}
            defaultLanguage={getType(activeFile?.name ?? "")?.language}
            beforeMount={handleBeforeMount}
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
