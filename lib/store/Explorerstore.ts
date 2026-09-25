// lib/store/ExplorerStore
import { create } from "zustand";
import { useCodestore } from "./Codestore";
import { ExplorerStore } from "../store/types/explorerTypes";

export const useExplorerstore = create<ExplorerStore>((set) => ({
  cache: {},

  members: [],

  activity: [],
  activityHistory: [],

  /* --------------- ACTIVITY ------------------- */

  setActivity: (activity) =>
    set((state) => ({
      activity: [activity, ...state.activity].slice(0, 20),
      activityHistory: [activity, ...state.activityHistory].slice(0, 50),
    })),

  removeActivity: (id) =>
    set((state) => ({
      activity: state.activity.filter((a) => a.id !== id),
    })),

  clearActivityHistory: () =>
    set({
      activity: [],
      activityHistory: [],
    }),

  /* --------------- MEMBER --------------------- */

  setMembers: (members) => {
    const uniqueMembers = [
      ...new Map(members.map((member) => [member.id, member])).values(),
    ];

    set({ members: uniqueMembers });
  },

  /* ---------------- LOAD FOLDER ---------------- */

  loadFolder: (data) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [data.parentId]: {
          rootFolder: data.rootFolder,
          folders: data.folders || [],
          files: data.files || [],
          loading: false,
          loaded: true,
        },
      },
    }));
  },

  setLoading: (fileId, loading) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [fileId]: {
          ...state.cache[fileId],
          loading,
        },
      },
    }));
  },

  setError: (fileId, err) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [fileId]: {
          ...state.cache[fileId],
          error: err,
          loaded: false,
          loading: false,
        },
      },
    }));
  },

  /* ---------------- SELECT FILE ---------------- */

  setSelectedFile: (parentId, fileId) =>
    set((state) => ({
      cache: {
        ...state.cache,
        [parentId]: {
          ...state.cache[parentId],
          selectedFileId: fileId,
        },
      },
    })),

  /* ---------------- ADD ---------------- */

  /* ---------------- ADD ---------------- */

  insertFile: (parentId, file) =>
    set((state) => {
      const current = state.cache[parentId];
      const existingFiles = current?.files ?? [];
      if (existingFiles.some((f) => f._id === file._id)) {
        return state;
      }
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...current,
            files: [...existingFiles, file],
            folders: current?.folders ?? [],
            loading: false,
            loaded: current?.loaded ?? true,
          },
        },
      };
    }),

  insertFolder: (parentId, folder) =>
    set((state) => {
      const current = state.cache[parentId];
      const existingFolders = current?.folders ?? [];
      if (existingFolders.some((f) => f._id === folder._id)) {
        return state;
      }
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...current,
            folders: [...existingFolders, folder],
            files: current?.files ?? [],
            loading: false,
            loaded: current?.loaded ?? true,
          },
        },
      };
    }),

  /* ---------------- RENAME ---------------- */

  updateFile: async (parentId, fileId, newName) => {
    set((state) => {
      const codestore = useCodestore.getState();

      const updatedOpenFiles = codestore.openFiles.map((f) =>
        f._id === fileId ? { ...f, name: newName } : f,
      );

      useCodestore.setState({
        openFiles: updatedOpenFiles,
      });
      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            files:
              state.cache[parentId]?.files.map((f) =>
                f._id === fileId ? { ...f, name: newName, renamed: true } : f,
              ) || [],
          },
        },
      };
    });
  },

  updateFileContent: (parentId, fileId, content) => {
    set((state) => {
      const folder = state.cache[parentId];
      if (!folder) return state;

      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...folder,
            files:
              folder.files?.map((f) =>
                f._id === fileId ? { ...f, content } : f,
              ) || [],
          },
        },
      };
    });
  },

  updateFolder: (parentId, folderId, newName) =>
    set((state) => {
      const newCache = { ...state.cache };

      // Update folder inside its parent
      if (parentId) {
        newCache[parentId] = {
          ...newCache[parentId],
          folders:
            newCache[parentId]?.folders.map((folder) =>
              folder._id === folderId
                ? {
                    ...folder,
                    name: newName,
                    renamed: true,
                  }
                : folder,
            ) ?? [],
        };
      }

      // Update the folder's own cache
      if (newCache[folderId]) {
        newCache[folderId] = {
          ...newCache[folderId],
          rootFolder: newCache[folderId].rootFolder
            ? {
                ...newCache[folderId].rootFolder,
                name: newName,
                renamed: true,
              }
            : undefined,
        };
      }

      return {
        cache: newCache,
      };
    }),

  /* ---------------- DELETE ---------------- */

  removeFile: async (parentId, fileId) => {
    set((state) => {
      const codestore = useCodestore.getState();
      codestore.closeFile(fileId);
      codestore.deleteCode?.(fileId);

      return {
        cache: {
          ...state.cache,
          [parentId]: {
            ...state.cache[parentId],
            files:
              state.cache[parentId]?.files.filter((f) => f._id !== fileId) ||
              [],
          },
        },
      };
    });
  },

  removeFolder: async (parentId, folderId) => {
    set((state) => {
      const newCache = { ...state.cache };
      const codestore = useCodestore.getState();
      const deletedFolderIds = new Set<string>();

      function removeFolderRecursively(id: string) {
        deletedFolderIds.add(id);
        const currentFolder = newCache[id];

        if (!currentFolder) return;

        // Close files from CodeStore
        currentFolder.files.forEach((file) => {
          codestore.closeFile(file._id);
        });

        // Delete child folders first
        currentFolder.folders.forEach((folder) => {
          removeFolderRecursively(folder._id);
        });

        // Delete this folder from cache
        delete newCache[id];
      }

      // Remove all descendants
      removeFolderRecursively(folderId);

      // Also ensure any open files whose parentDirId or parentId matches deleted folders are closed
      codestore.openFiles.forEach((file) => {
        const pId = file.parentDirId || file.parentId;
        if (pId && deletedFolderIds.has(pId)) {
          codestore.closeFile(file._id);
        }
      });

      // Remove folder reference from parent
      newCache[parentId] = {
        ...newCache[parentId],
        folders:
          newCache[parentId]?.folders.filter((f) => f._id !== folderId) || [],
      };

      return {
        cache: newCache,
      };
    });
  },

  /* ---------------- RollBack (restore) ---------------- */

  restore: async (fileId, prevData) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [fileId]: {
          ...prevData,
          loading: false,
          loaded: true,
        },
      },
    }));
  },
}));
