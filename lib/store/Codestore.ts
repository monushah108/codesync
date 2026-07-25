import { create } from "zustand";
import { CodeState, Store } from "./types";
import { useCodeActions } from "./actions/useCodeAction";

export const useCodestore = create<Store>((set, get) => {
  const updateCode = (fileId: string, data: Partial<CodeState>) =>
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
    user: {},

    response: {},

    // set User
    setUser: (user) => set({ user }),

    /* ---------------- LOAD FILE CONTENT ---------------- */

    // OPEN FILE
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

    // CLOSE FILE
    closeFile: (fileId) =>
      set((state) => {
        const files = state.openFiles.filter((f) => f._id !== fileId);

        return {
          openFiles: files,

          activeFileId:
            state.activeFileId === fileId
              ? files.at(-1)?._id || null
              : state.activeFileId,
        };
      }),

    // ACTIVE FILE
    setActiveFile: (activeFileId) =>
      set({
        activeFileId,
      }),

    // EDIT STATUS
    // setFileEdited: (fileId, edited) =>
    //   set((state) => {
    //     console.log("SET FILE EDITED", fileId, edited);
    //     return {
    //       openFiles: state.openFiles.map((file) =>
    //         file._id === fileId
    //           ? {
    //               ...file,

    //               isEdited: edited,
    //             }
    //           : file,
    //       ),
    //     };
    //   }),

    setFileEdited: (fileId, edited) =>
      set((state) => {
        return {
          openFiles: state.openFiles.map((file) =>
            file._id === fileId
              ? {
                  ...file,
                  isEdited: edited,
                }
              : file,
          ),
        };
      }),

    // UPDATE CONTENT
    updateContent: (fileId, content) => {
      updateCode(fileId, {
        content,
      });

      get().setFileEdited(fileId, true);
    },

    // LOAD FILE
    setLoadedFile: (fileId, data) => {
      const cache = get().code[fileId];

      if (cache?.loading || cache?.loaded) return;

      updateCode(fileId, {
        content: data?.content || "",
        savedContent: data?.content || "",
        loaded: true,
        loading: false,
      });
    },

    setLoading: (fileId, loading) => {
      updateCode(fileId, {
        ...get().code[fileId],
        loading,
      });
      // set((state) => ({
      //   code: {
      //     ...state.code,
      //     [fileId]: {
      //       ...state.code[fileId],
      //       loading,
      //     },
      //   },
      // }));
    },

    setLoadFileError: (fileId, err) => {
      updateCode(fileId, {
        ...get().code[fileId],
        error: err,
      });
    },

    /*----------------- SAVE FILE CONTENT ------------------- */

    // SAVE FILE
    setSavedFile: (fileId, content) => {
      updateCode(fileId, {
        saving: true,
        content,
      });

      const IsSaved = get().code[fileId]?.savedContent == content;

      if (IsSaved) {
        updateCode(fileId, {
          saving: false,
        });
        return;
      }

      get().setFileEdited(fileId, false);

      updateCode(fileId, {
        content,
        savedContent: content,
        saving: false,
      });
    },

    setSaving: (fileId, saving) => {
      set((state) => ({
        code: {
          ...state.code,
          [fileId]: {
            ...state.code[fileId],
            loading: saving,
          },
        },
      }));
    },

    setSavedFileError: (fileId, err) => {
      updateCode(fileId, {
        ...get().code[fileId],
        error: err,
      });

      // set((state) => ({
      //   code: {
      //     ...state.code,
      //     [fileId]: {
      //       ...state.code[fileId],
      //       error: err,
      //     },
      //   },
      // }));
    },

    /*------------- CODE EXECUTION --------------- */
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

    addOutput: (output) => {
      set((state) => ({
        outputs: [...state.outputs, output],
      }));
    },

    removeOutput: (id) =>
      set((state) => ({
        outputs: state.outputs.filter((o) => o.id !== id),
      })),

    clearOutputs: () => set({ outputs: [] }),

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

        "run code": async () => await useCodeActions.runCode(fileId),
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

    /*------------- AI CODE GENERATING --------------- */
    setClearResponse: () =>
      set({
        response: {
          data: [],
          loading: false,
          loaded: false,
          error: null,
        },
      }),
    addMessage: (message) =>
      set((state) => ({
        response: {
          ...state.response,
          data: [...(state.response.data || []), message],
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
    setGeneratedError: (err) => {
      console.log("setGeneartedError", prompt);
      set((state) => ({
        response: {
          ...state.response,
          loading: false,
          loaded: true,
          error: err instanceof Error ? err.message : String(err),
        },
      }));
    },
  };
});
