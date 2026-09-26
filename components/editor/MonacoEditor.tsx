"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Editor, BeforeMount, OnMount } from "@monaco-editor/react";
import * as Y from "yjs";
import { ChevronRight, Lock, Sparkles } from "lucide-react";
import { Icon } from "@iconify/react";

import { getFileIcon, getType } from "@/lib/features";
import { useCodestore } from "@/lib/store/Codestore";
import { useYjs } from "@/lib/hooks/useYjs";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import Emptypage from "./ui/Emptypage";
import TabBar from "./ui/TabBar";
import EditorAiControlBar from "./ui/EditorAiControlBar";

import {
  defineVsCodeTheme,
  VSCODE_DARK_CUSTOM_THEME,
} from "./monaco/monacoTheme";
import {
  updateRemoteCursorStyles,
  clearRemoteCursorStyles,
  IDLE_CHECK_INTERVAL_MS,
} from "./monaco/remoteCursorStyles";
import { getMonacoBinding } from "./monaco/monacoBinding";
import { registerEditorKeybindings } from "./monaco/editorKeybindings";
import { useMonacoAiEdit } from "./monaco/useMonacoAiEdit";

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

  // Antigravity AI Edit Hook (streaming, cursor tracking, diff review, accept/reject)
  const {
    handleOpenAiPrompt,
    handleSendEdit,
    handleStop,
    handleAccept,
    handleReject,
    handleRetry,
    clearAiDecorations,
  } = useMonacoAiEdit({
    editorRef,
    roomId,
    activeFile,
    activeFileId,
    isViewer,
  });

  if (!activeFileId) {
    return <Emptypage roomId={roomId} />;
  }

  const handleBeforeMount: BeforeMount = (monaco) => {
    (window as any).monaco = monaco;
    defineVsCodeTheme(monaco);
  };

  const handleMount: OnMount = async (editor, monaco) => {
    (window as any).monaco = monaco;
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
      onOpenAiPrompt: handleOpenAiPrompt,
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
      clearAiDecorations();

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
        {/* Antigravity AI Live Editor Control Bar (Stop / Accept / Reject / Retry) */}
        <EditorAiControlBar
          onStop={handleStop}
          onAccept={handleAccept}
          onReject={handleReject}
          onRetry={handleRetry}
        />

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
