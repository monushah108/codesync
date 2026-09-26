"use client";

import { create } from "zustand";

export type AiMode = "edit" | "fix" | "explain" | "generate";
export type AiEditStatus = "idle" | "streaming" | "reviewing" | "explaining";

export interface SelectionRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  selectedText: string;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface DiffRange {
  startLine: number;
  endLine: number;
}

export interface AiEditState {
  isOpen: boolean;
  status: AiEditStatus;
  mode: AiMode;
  prompt: string;
  fileId: string | null;
  fileName: string | null;
  selection: SelectionRange | null;
  cursorPosition: CursorPosition | null;
  originalText: string;
  generatedText: string;
  explanationText: string;
  error: string | null;
  diffRange: DiffRange | null;
  aiCursorPosition: CursorPosition | null;
  remoteAiCursors: Record<string, { position: CursorPosition; userName?: string }>;

  // Widget positioning
  widgetPosition: {
    top: number;
    left: number;
  } | null;

  // Actions
  openWidget: (options: {
    fileId: string;
    fileName: string;
    selection?: SelectionRange | null;
    cursorPosition?: CursorPosition | null;
    initialMode?: AiMode;
    initialPrompt?: string;
    position?: { top: number; left: number };
  }) => void;
  closeWidget: () => void;
  setPrompt: (prompt: string) => void;
  setMode: (mode: AiMode) => void;
  startGenerating: (originalText: string, mode?: AiMode) => void;
  setToken: (token: string, fullText: string, aiCursor?: CursorPosition) => void;
  appendExplanation: (token: string) => void;
  finishGenerating: (fullText: string, diffRange?: DiffRange) => void;
  stopGenerating: () => void;
  resetEdit: () => void;
  setError: (error: string | null) => void;
  setAiCursorPosition: (position: CursorPosition | null) => void;
  setRemoteAiCursor: (userId: string, position: CursorPosition | null, userName?: string) => void;
  setWidgetPosition: (position: { top: number; left: number } | null) => void;
  triggerEdit: (prompt: string, mode?: AiMode) => void;
}

export const useAiEditStore = create<AiEditState>((set) => ({
  isOpen: false,
  status: "idle",
  mode: "edit",
  prompt: "",
  fileId: null,
  fileName: null,
  selection: null,
  cursorPosition: null,
  originalText: "",
  generatedText: "",
  explanationText: "",
  error: null,
  diffRange: null,
  aiCursorPosition: null,
  remoteAiCursors: {},
  widgetPosition: null,

  openWidget: ({
    fileId,
    fileName,
    selection = null,
    cursorPosition = null,
    initialMode = "edit",
    initialPrompt = "",
    position,
  }) =>
    set({
      isOpen: true,
      status: "idle",
      mode: initialMode,
      prompt: initialPrompt,
      fileId,
      fileName,
      selection,
      cursorPosition,
      originalText: selection?.selectedText ?? "",
      generatedText: "",
      explanationText: "",
      error: null,
      diffRange: null,
      aiCursorPosition: null,
      widgetPosition: position ?? null,
    }),

  closeWidget: () =>
    set({
      isOpen: false,
      status: "idle",
      prompt: "",
      selection: null,
      originalText: "",
      generatedText: "",
      explanationText: "",
      error: null,
      diffRange: null,
      aiCursorPosition: null,
      widgetPosition: null,
    }),

  setPrompt: (prompt) => set({ prompt }),

  setMode: (mode) => set({ mode }),

  startGenerating: (originalText, mode) =>
    set((state) => ({
      status: mode === "explain" ? "explaining" : "streaming",
      mode: mode ?? state.mode,
      originalText,
      generatedText: "",
      explanationText: "",
      error: null,
    })),

  setToken: (token, fullText, aiCursor) =>
    set((state) => ({
      generatedText: fullText,
      aiCursorPosition: aiCursor ?? state.aiCursorPosition,
    })),

  appendExplanation: (token) =>
    set((state) => ({
      explanationText: state.explanationText + token,
    })),

  finishGenerating: (fullText, diffRange) =>
    set((state) => ({
      status: state.mode === "explain" ? "explaining" : "reviewing",
      generatedText: fullText,
      diffRange: diffRange ?? state.diffRange,
      aiCursorPosition: null,
    })),

  stopGenerating: () =>
    set((state) => ({
      status: state.mode === "explain" ? "explaining" : "reviewing",
      aiCursorPosition: null,
    })),

  resetEdit: () =>
    set({
      status: "idle",
      generatedText: "",
      explanationText: "",
      error: null,
      diffRange: null,
      aiCursorPosition: null,
    }),

  setError: (error) =>
    set({
      error,
      status: "idle",
      aiCursorPosition: null,
    }),

  setAiCursorPosition: (aiCursorPosition) => set({ aiCursorPosition }),

  setRemoteAiCursor: (userId, position, userName) =>
    set((state) => {
      const updated = { ...state.remoteAiCursors };
      if (!position) {
        delete updated[userId];
      } else {
        updated[userId] = { position, userName };
      }
      return { remoteAiCursors: updated };
    }),

  setWidgetPosition: (widgetPosition) => set({ widgetPosition }),

  triggerEdit: (prompt, mode = "edit") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("ai:trigger-code-edit", {
          detail: { prompt, mode },
        }),
      );
    }
  },
}));
