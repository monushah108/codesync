import { useExplorerstore } from "../Explorerstore";
import * as ExplorerApi from "@/lib/api/explorerApi";
import { ExplorerActionsMethods } from "./types";
export const useExplorerActions: ExplorerActionsMethods = {
  async loadFolder(roomId: string, parentId: string = "") {
    console.log("loadFolder called", parentId);

    const store = useExplorerstore.getState();

    store.setLoading(parentId, true);

    try {
      const data = await ExplorerApi.loadFolder(roomId, parentId);

      if (!data) {
        throw new Error("Folder data is empty");
      }

      store.loadFolder(data);

      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load folder";

      store.setError(parentId, message);

      return undefined;
    } finally {
      store.setLoading(parentId, false);
    }
  },

  async addFolder(roomId: string, parentId: string, name: string) {
    const store = useExplorerstore.getState();

    try {
      const data = await ExplorerApi.createFolder(roomId, parentId, name);

      if (!data) {
        throw new Error("Folder was not created");
      }

      store.insertFolder(parentId, data);

      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create folder";

      store.setError(parentId, message);

      return undefined;
    }
  },

  async addFile(roomId: string, parentId: string, name: string) {
    const store = useExplorerstore.getState();

    try {
      const data = await ExplorerApi.createFile(roomId, parentId, name);

      if (!data) {
        throw new Error("File was not created");
      }

      store.insertFile(parentId, data);

      return data;
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Failed to create file";

      store.setError(parentId, message);

      return undefined;
    }
  },

  async renameFolder(
    roomId: string,
    parentId: string,
    folderId: string,
    newName: string,
  ) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.renameFolder(roomId, folderId, newName);

      store.updateFolder(parentId, folderId, newName);
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Failed to rename folder";

      store.setError(parentId, message);
    }
  },

  async renameFile(
    roomId: string,
    parentId: string,
    fileId: string,
    newName: string,
  ) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.renameFile(roomId, fileId, newName);

      store.updateFile(parentId, fileId, newName);
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Failed to rename file";

      store.setError(parentId, message);
    }
  },

  async deleteFolder(roomId: string, parentId: string, folderId: string) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.deleteFolder(roomId, folderId);

      store.removeFolder(parentId, folderId);
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Failed to delete folder";

      store.setError(parentId, message);
    }
  },

  async deleteFile(roomId: string, parentId: string, fileId: string) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.deleteFile(roomId, fileId);

      store.removeFile(parentId, fileId);
    } catch (err: unknown) {
      console.error(err);

      const message =
        err instanceof Error ? err.message : "Failed to delete file";

      store.setError(parentId, message);
    }
  },
};
