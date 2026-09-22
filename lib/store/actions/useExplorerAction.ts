import { useExplorerstore } from "../Explorerstore";
import * as ExplorerApi from "@/lib/api/explorerApi";
import { notify } from "@/lib/store/Notificationstore";
import { ExplorerActionsMethods } from "./types";

const inFlightFolderRequests = new Map<string, Promise<any>>();

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}

export const useExplorerActions: ExplorerActionsMethods = {
  async loadFolder(roomId: string, parentId: string) {
    const store = useExplorerstore.getState();

    const cachedFolder = store.cache[parentId];
    if (cachedFolder?.loaded || cachedFolder?.loading) {
      return cachedFolder;
    }

    const requestKey = `${roomId}:${parentId}`;
    const existing = inFlightFolderRequests.get(requestKey);
    if (existing) {
      return existing;
    }

    store.setLoading(parentId, true);

    const promise = (async () => {
      try {
        const data = await ExplorerApi.loadFolder(roomId, parentId);

        if (!data) {
          throw new Error("Folder data is empty");
        }

        store.loadFolder({
          parentId,
          ...data,
        });

        return data;
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to load folder");
        store.setError(parentId, message);
        return undefined;
      } finally {
        store.setLoading(parentId, false);
        inFlightFolderRequests.delete(requestKey);
      }
    })();

    inFlightFolderRequests.set(requestKey, promise);
    return promise;
  },

  async addFolder(roomId: string, parentId: string, name: string) {
    const store = useExplorerstore.getState();

    try {
      const data = await ExplorerApi.createFolder(roomId, parentId, name);
      store.insertFolder(parentId, data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to create folder");
      notify.error("Creation Failed", message, "Explorer");
      return undefined;
    }
  },

  async addFile(roomId: string, parentId: string, name: string) {
    const store = useExplorerstore.getState();

    try {
      const data = await ExplorerApi.createFile(roomId, parentId, name);
      store.insertFile(parentId, data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to create file");
      notify.error("Creation Failed", message, "Explorer");
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
      const message = getErrorMessage(err, "Failed to rename folder");
      notify.error("Rename Failed", message, "Explorer");
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
      const message = getErrorMessage(err, "Failed to rename file");
      notify.error("Rename Failed", message, "Explorer");
    }
  },

  async deleteFolder(roomId: string, parentId: string, folderId: string) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.deleteFolder(roomId, folderId);
      store.removeFolder(parentId, folderId);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete folder");
      notify.error("Delete Failed", message, "Explorer");
    }
  },

  async deleteFile(roomId: string, parentId: string, fileId: string) {
    const store = useExplorerstore.getState();

    try {
      await ExplorerApi.deleteFile(roomId, fileId);
      store.removeFile(parentId, fileId);
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to delete file");
      notify.error("Delete Failed", message, "Explorer");
    }
  },
};

