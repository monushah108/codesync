"use client";

import { useCallback, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { useCodestore } from "@/lib/store/Codestore";
import { useAiEditStore, AiMode } from "@/lib/store/useAiEditStore";
import { getType } from "@/lib/features";
import { toast } from "sonner";
import type { OpenFile } from "@/lib/store/types/codeTypes";

interface UseMonacoAiEditParams {
  editorRef: React.RefObject<any>;
  roomId: string;
  activeFile: OpenFile | undefined;
  activeFileId: string | null;
  isViewer: boolean;
}

export function useMonacoAiEdit({
  editorRef,
  roomId,
  activeFile,
  activeFileId,
  isViewer,
}: UseMonacoAiEditParams) {
  const aiCursorDecorationsRef = useRef<string[]>([]);
  const diffDecorationsRef = useRef<string[]>([]);
  const remoteAiDecorationsRef = useRef<Map<string, string[]>>(new Map());
  const originalSnapshotTextRef = useRef<string>("");
  const currentEditRangeRef = useRef<{
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  } | null>(null);

  const clearAiDecorations = useCallback(() => {
    if (editorRef.current) {
      if (aiCursorDecorationsRef.current.length > 0) {
        aiCursorDecorationsRef.current = editorRef.current.deltaDecorations(
          aiCursorDecorationsRef.current,
          [],
        );
      }
      if (diffDecorationsRef.current.length > 0) {
        diffDecorationsRef.current = editorRef.current.deltaDecorations(
          diffDecorationsRef.current,
          [],
        );
      }
    }
  }, [editorRef]);

  // 1. Open AI prompt with current selection / cursor context
  const handleOpenAiPrompt = useCallback(() => {
    if (isViewer) return;
    const editor = editorRef.current;
    if (!editor || !activeFile) return;

    const sel = editor.getSelection();
    const pos = editor.getPosition();
    const model = editor.getModel();

    let selectionData = null;
    if (sel && !sel.isEmpty()) {
      selectionData = {
        startLineNumber: sel.startLineNumber,
        startColumn: sel.startColumn,
        endLineNumber: sel.endLineNumber,
        endColumn: sel.endColumn,
        selectedText: model ? model.getValueInRange(sel) : "",
      };
    }

    useAiEditStore.getState().openWidget({
      fileId: activeFile._id,
      fileName: activeFile.name,
      selection: selectionData,
      cursorPosition: pos ? { lineNumber: pos.lineNumber, column: pos.column } : null,
      initialMode: "edit",
    });
  }, [isViewer, activeFile, editorRef]);

  // 2. Send instruction to AI
  const handleSendEdit = useCallback(
    (promptText: string, editMode: AiMode) => {
      const editor = editorRef.current;
      if (!editor || !activeFileId || !activeFile) return;
      const model = editor.getModel();
      if (!model) return;

      const sel = editor.getSelection();
      const hasSelection = sel && !sel.isEmpty();

      let targetRange: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
      };
      let originalSnippet: string;

      if (hasSelection) {
        targetRange = {
          startLineNumber: sel.startLineNumber,
          startColumn: sel.startColumn,
          endLineNumber: sel.endLineNumber,
          endColumn: sel.endColumn,
        };
        originalSnippet = model.getValueInRange(sel);
      } else {
        const lineCount = model.getLineCount();
        targetRange = {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: lineCount,
          endColumn: model.getLineMaxColumn(lineCount),
        };
        originalSnippet = model.getValue();
      }

      originalSnapshotTextRef.current = originalSnippet;
      currentEditRangeRef.current = { ...targetRange };

      useAiEditStore.getState().startGenerating(originalSnippet, editMode);

      const user = useCodestore.getState().user;

      socket.emit("ai:edit", {
        roomId,
        fileId: activeFileId,
        user,
        prompt: promptText,
        mode: editMode,
        selection: hasSelection
          ? {
              ...targetRange,
              selectedText: originalSnippet,
            }
          : null,
        cursorPosition: editor.getPosition(),
        fileName: activeFile.name,
        language: getType(activeFile.name)?.language,
        currentContent: model.getValue(),
      });
    },
    [roomId, activeFileId, activeFile, editorRef],
  );

  // 3. Stop AI Streaming
  const handleStop = useCallback(() => {
    socket.emit("ai:stop", { roomId });
    if (editorRef.current && aiCursorDecorationsRef.current.length > 0) {
      aiCursorDecorationsRef.current = editorRef.current.deltaDecorations(
        aiCursorDecorationsRef.current,
        [],
      );
    }
    useAiEditStore.getState().stopGenerating();
    toast.info("AI generation stopped");
  }, [roomId, editorRef]);

  // 4. Accept AI Edit
  const handleAccept = useCallback(() => {
    clearAiDecorations();
    useAiEditStore.getState().closeWidget();
    toast.success("AI changes accepted");
  }, [clearAiDecorations]);

  // 5. Reject AI Edit (Revert to original snapshot)
  const handleReject = useCallback(() => {
    const editor = editorRef.current;
    const monaco = (window as any).monaco;

    if (
      editor &&
      monaco &&
      currentEditRangeRef.current &&
      originalSnapshotTextRef.current !== undefined
    ) {
      const range = new monaco.Range(
        currentEditRangeRef.current.startLineNumber,
        currentEditRangeRef.current.startColumn,
        currentEditRangeRef.current.endLineNumber,
        currentEditRangeRef.current.endColumn,
      );

      editor.executeEdits("antigravity-ai-reject", [
        {
          range,
          text: originalSnapshotTextRef.current,
          forceMoveMarkers: true,
        },
      ]);
    }

    clearAiDecorations();
    useAiEditStore.getState().closeWidget();
    toast.info("AI changes reverted");
  }, [clearAiDecorations, editorRef]);

  // 6. Retry AI Edit
  const handleRetry = useCallback(() => {
    const editor = editorRef.current;
    const monaco = (window as any).monaco;

    if (
      editor &&
      monaco &&
      currentEditRangeRef.current &&
      originalSnapshotTextRef.current !== undefined
    ) {
      const range = new monaco.Range(
        currentEditRangeRef.current.startLineNumber,
        currentEditRangeRef.current.startColumn,
        currentEditRangeRef.current.endLineNumber,
        currentEditRangeRef.current.endColumn,
      );

      editor.executeEdits("antigravity-ai-retry", [
        {
          range,
          text: originalSnapshotTextRef.current,
          forceMoveMarkers: true,
        },
      ]);
    }
    clearAiDecorations();

    const currentPrompt = useAiEditStore.getState().prompt;
    const currentMode = useAiEditStore.getState().mode;
    handleSendEdit(currentPrompt, currentMode);
  }, [clearAiDecorations, handleSendEdit, editorRef]);

  // 7. Socket Event Listeners for Live Streaming & Cursor Awareness
  useEffect(() => {
    if (!roomId || !activeFileId) return;

    const handleAiEditToken = ({
      fileId,
      token,
      fullText,
      mode,
    }: {
      fileId: string;
      token: string;
      fullText: string;
      mode: AiMode;
    }) => {
      if (fileId !== activeFileId) return;

      const store = useAiEditStore.getState();

      if (mode === "explain") {
        store.appendExplanation(token);
        return;
      }

      const editor = editorRef.current;
      if (!editor || !currentEditRangeRef.current) return;
      const model = editor.getModel();
      if (!model) return;

      const monaco = (window as any).monaco;
      if (!monaco) return;

      const startLine = currentEditRangeRef.current.startLineNumber;
      const startCol = currentEditRangeRef.current.startColumn;
      const prevEndLine = currentEditRangeRef.current.endLineNumber;
      const prevEndCol = currentEditRangeRef.current.endColumn;

      const editRange = new monaco.Range(startLine, startCol, prevEndLine, prevEndCol);

      editor.executeEdits("antigravity-ai-stream", [
        {
          range: editRange,
          text: fullText,
          forceMoveMarkers: true,
        },
      ]);

      // Calculate new cursor position and end range
      const lines = fullText.split("\n");
      const newEndLine = startLine + lines.length - 1;
      const newEndCol =
        lines.length === 1
          ? startCol + fullText.length
          : (lines[lines.length - 1]?.length || 0) + 1;

      currentEditRangeRef.current.endLineNumber = newEndLine;
      currentEditRangeRef.current.endColumn = newEndCol;

      // Real-time AI Cursor Decoration in Monaco
      aiCursorDecorationsRef.current = editor.deltaDecorations(
        aiCursorDecorationsRef.current,
        [
          {
            range: new monaco.Range(newEndLine, newEndCol, newEndLine, newEndCol),
            options: {
              className: "antigravity-ai-cursor",
              isWholeLine: false,
              hoverMessage: { value: "**🤖 Antigravity AI** is editing code here" },
            },
          },
        ],
      );

      // Real-time Line Diff Decoration in Monaco
      diffDecorationsRef.current = editor.deltaDecorations(
        diffDecorationsRef.current,
        [
          {
            range: new monaco.Range(startLine, 1, newEndLine, 1),
            options: {
              isWholeLine: true,
              className: "antigravity-diff-added-line",
              linesDecorationsClassName: "antigravity-diff-added-gutter",
            },
          },
        ],
      );

      // Auto-reveal position smoothly
      editor.revealPositionInCenterIfOutsideViewport({
        lineNumber: newEndLine,
        column: newEndCol,
      });

      store.setToken(token, fullText, {
        lineNumber: newEndLine,
        column: newEndCol,
      });

      // Broadcast collaborative cursor to other users in the room
      socket.emit("ai:cursor", {
        roomId,
        fileId: activeFileId,
        position: { lineNumber: newEndLine, column: newEndCol },
        user: useCodestore.getState().user,
      });
    };

    const handleAiEditDone = ({
      fileId,
      fullText,
    }: {
      fileId: string;
      fullText: string;
    }) => {
      if (fileId !== activeFileId) return;

      if (editorRef.current && aiCursorDecorationsRef.current.length > 0) {
        aiCursorDecorationsRef.current = editorRef.current.deltaDecorations(
          aiCursorDecorationsRef.current,
          [],
        );
      }

      useAiEditStore.getState().finishGenerating(fullText, {
        startLine: currentEditRangeRef.current?.startLineNumber ?? 1,
        endLine: currentEditRangeRef.current?.endLineNumber ?? 1,
      });
    };

    const handleAiStopped = () => {
      if (editorRef.current && aiCursorDecorationsRef.current.length > 0) {
        aiCursorDecorationsRef.current = editorRef.current.deltaDecorations(
          aiCursorDecorationsRef.current,
          [],
        );
      }
      useAiEditStore.getState().stopGenerating();
    };

    const handleAiEditError = ({
      fileId,
      message,
    }: {
      fileId?: string;
      message: string;
    }) => {
      if (fileId && fileId !== activeFileId) return;
      if (editorRef.current && aiCursorDecorationsRef.current.length > 0) {
        aiCursorDecorationsRef.current = editorRef.current.deltaDecorations(
          aiCursorDecorationsRef.current,
          [],
        );
      }
      useAiEditStore.getState().setError(message);
      toast.error(message);
    };

    // Remote AI cursor awareness from collaborators
    const handleRemoteAiCursor = ({
      fileId,
      position,
      user,
    }: {
      fileId: string;
      position: { lineNumber: number; column: number } | null;
      user?: any;
    }) => {
      if (fileId !== activeFileId || !editorRef.current) return;
      const monaco = (window as any).monaco;
      if (!monaco) return;

      const userId = user?.id || "remote-ai";
      const prevDecs = remoteAiDecorationsRef.current.get(userId) || [];

      if (!position) {
        remoteAiDecorationsRef.current.set(
          userId,
          editorRef.current.deltaDecorations(prevDecs, []),
        );
        return;
      }

      const newDecs = editorRef.current.deltaDecorations(prevDecs, [
        {
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column,
          ),
          options: {
            className: "antigravity-ai-cursor",
            isWholeLine: false,
            hoverMessage: {
              value: `**🤖 Antigravity AI** (${user?.name || "Collaborator"}) is editing here`,
            },
          },
        },
      ]);
      remoteAiDecorationsRef.current.set(userId, newDecs);
    };

    socket.on("ai:edit:token", handleAiEditToken);
    socket.on("ai:edit:done", handleAiEditDone);
    socket.on("ai:stopped", handleAiStopped);
    socket.on("ai:edit:error", handleAiEditError);
    socket.on("ai:cursor", handleRemoteAiCursor);

    // Listen to trigger event from Chat section
    const handleTriggerEditEvent = (
      e: Event,
    ) => {
      const customEvent = e as CustomEvent<{ prompt: string; mode?: AiMode }>;
      const { prompt: promptText, mode: editMode = "edit" } = customEvent.detail || {};
      if (!promptText || !activeFile) return;
      handleSendEdit(promptText, editMode);
    };

    window.addEventListener(
      "ai:trigger-code-edit",
      handleTriggerEditEvent,
    );

    return () => {
      socket.off("ai:edit:token", handleAiEditToken);
      socket.off("ai:edit:done", handleAiEditDone);
      socket.off("ai:stopped", handleAiStopped);
      socket.off("ai:edit:error", handleAiEditError);
      socket.off("ai:cursor", handleRemoteAiCursor);
      window.removeEventListener(
        "ai:trigger-code-edit",
        handleTriggerEditEvent,
      );

      clearAiDecorations();
    };
  }, [roomId, activeFileId, activeFile, clearAiDecorations, editorRef, handleSendEdit]);

  return {
    handleOpenAiPrompt,
    handleSendEdit,
    handleStop,
    handleAccept,
    handleReject,
    handleRetry,
    clearAiDecorations,
  };
}
