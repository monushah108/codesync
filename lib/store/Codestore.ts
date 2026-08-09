import { create } from "zustand";
import type { CodeFileState, Store, AIMessage } from "../store/types/codeTypes";
import { useCodeActions } from "./actions/useCodeAction";

export const useCodestore = create<Store>((set, get) => {
  const updateCode = (fileId: string, data: Partial<CodeFileState>) =>
    set((state) => ({
      code: {
        ...state.code,

        [fileId]: {
          ...(state.code[fileId] || {
            content: "",
          }),

          ...data,
        },
      },
    }));

  return {
    code: {},

    openFiles: [],

    activeFileId: null,

    outputs: [],

    user: null,

    response: {
      data: [],
      loading: false,
      loaded: false,
      error: null,
    },

    setUser: (user) => set({ user }),

    openFile: async (file, roomId) => {
      set((state) => ({
        activeFileId: file._id,

        openFiles: state.openFiles.some((f) => f._id === file._id)
          ? state.openFiles
          : [
              ...state.openFiles,
              {
                ...file,
                isEdited: false,
              },
            ],
      }));

      await useCodeActions.loadFile(roomId, file._id);
    },

    closeFile: (fileId) =>
      set((state) => {
        const files = state.openFiles.filter((file) => file._id !== fileId);

        return {
          openFiles: files,

          activeFileId:
            state.activeFileId === fileId
              ? (files.at(-1)?._id ?? null)
              : state.activeFileId,
        };
      }),

    setActiveFile: (activeFileId) =>
      set({
        activeFileId,
      }),

    setFileEdited: (fileId, edited) =>
      set((state) => ({
        openFiles: state.openFiles.map((file) =>
          file._id === fileId
            ? {
                ...file,
                isEdited: edited,
              }
            : file,
        ),
      })),

    updateContent: (fileId, content) => {
      updateCode(fileId, {
        content,
      });

      get().setFileEdited(fileId, true);
    },

    setLoadedFile: (fileId, data) => {
      updateCode(fileId, {
        content: data.content ?? "",
        savedContent: data.content ?? "",
        loaded: true,
        loading: false,
        error: null,
      });
    },

    setLoading: (fileId, loading) => {
      updateCode(fileId, {
        loading,
      });
    },

    setLoadFileError: (fileId, error) => {
      updateCode(fileId, {
        error,
        loading: false,
      });
    },

    setSavedFile: (fileId, content) => {
      updateCode(fileId, {
        content,
        savedContent: content,
        saving: false,
        error: null,
      });

      get().setFileEdited(fileId, false);
    },

    setSaving: (fileId, saving) => {
      updateCode(fileId, {
        saving,
      });
    },

    setSavedFileError: (fileId, error) => {
      updateCode(fileId, {
        error,
        saving: false,
      });
    },

    setExecutionResult: (fileId, result) => {
      updateCode(fileId, {
        running: false,
      });

      set((state) => ({
        outputs: [
          ...state.outputs,
          {
            id: crypto.randomUUID(),
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            message: result.message,
            error: result.error,
            loaded: true,
          },
        ],
      }));
    },

    addOutput: (output) =>
      set((state) => ({
        outputs: [...state.outputs, output],
      })),

    removeOutput: (id) =>
      set((state) => ({
        outputs: state.outputs.filter((output) => output.id !== id),
      })),

    clearOutputs: () =>
      set({
        outputs: [],
      }),

    runCommand: async (command, fileId) => {
      const cmd = command.trim().toLowerCase();

      const commands: Record<string, () => Promise<void> | void> = {
        clear: () => get().clearOutputs(),

        help: () =>
          get().addOutput({
            id: crypto.randomUUID(),
            stdout: [
              "Available commands:",
              "• help",
              "• clear",
              "• run code",
            ].join("\n"),
          }),

        "run code": async () => {
          await useCodeActions.runCode(fileId);
        },
      };

      const action = commands[cmd];

      if (!action) {
        get().addOutput({
          id: crypto.randomUUID(),
          stderr: `Command not found: ${command}`,
        });

        return;
      }

      await action();
    },

    // ---------------- AI RESPONSE ----------------

    setClearResponse: () =>
      set({
        response: {
          data: [],
          loading: false,
          loaded: false,
          error: null,
        },
      }),

    // Works for BOTH user and AI
    addMessage: (message: AIMessage) =>
      set((state) => ({
        response: {
          ...state.response,

          data: [...state.response.data, message],
        },
      })),

    setGenerating: (generating) =>
      set((state) => ({
        response: {
          ...state.response,
          loading: generating,
          loaded: !generating,
        },
      })),

    setGeneratedError: (error) =>
      set((state) => ({
        response: {
          ...state.response,
          loading: false,
          loaded: true,
          error: error instanceof Error ? error.message : String(error),
        },
      })),
  };
});
