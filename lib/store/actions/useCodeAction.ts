import * as codeApi from "@/lib/api/codeApi";
import { socket } from "@/lib/socket";
import { useCodestore } from "../Codestore";
import {
  ExecutionResult,
  type CodeActions,
  type ExecutionError,
} from "./types";
import { ExplorerFile } from "../types/explorerTypes";
import { notify } from "../Notificationstore";

export const useCodeActions: CodeActions = {
  async loadFile(roomId: string, fileId: string) {
    const store = useCodestore.getState();

    const cache = store.code[fileId];

    // Already loaded or currently loading
    if (cache?.loaded || cache?.loading) {
      return;
    }

    store.setLoading(fileId, true);

    try {
      const data = await codeApi.fetchFile<ExplorerFile>(roomId, fileId);

      store.setLoadedFile(fileId, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load file";
      store.setLoadFileError(fileId, message);
      notify.error("Load Failed", message, "File System");
    } finally {
      store.setLoading(fileId, false);
    }
  },

  async saveFile(roomId: string, fileId: string, content: string) {
    const store = useCodestore.getState();

    const file = store.code[fileId];

    if (!file) {
      return;
    }

    if (file.savedContent === content) {
      store.setFileEdited(fileId, false);
      return;
    }

    store.setFileEdited(fileId, true);
    store.setSaving(fileId, true);

    try {
      await codeApi.persistFile(roomId, fileId, content);

      store.setSavedFile(fileId, content);
      store.setFileEdited(fileId, false);

      const activeFile = store.openFiles.find((f) => f._id === fileId);
      notify.success("File Saved", `${activeFile?.name || "File"} saved successfully`, "Editor");

      // Realtime notification to other users to update their Zustand caches directly without calling DB
      socket.emit("file:saved", {
        roomId,
        fileId,
        content,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save file";
      store.setSavedFileError(fileId, message);
      notify.error("Save Failed", message, "Editor");
    } finally {
      store.setSaving(fileId, false);
    }
  },
  async runCode(fileId: string) {
    const store = useCodestore.getState();

    const file = store.openFiles.find((f) => f._id === fileId);

    if (!file) {
      return undefined;
    }

    const source = store.code[fileId]?.content;

    if (!source?.trim()) {
      const error: ExecutionError = {
        id: crypto.randomUUID(),
        error: "No code to execute",
      };

      store.addOutput(error);

      return error;
    }

    const loadingId = crypto.randomUUID();

    store.addOutput({
      id: loadingId,
      stdout: "⏳ Running code...",
      loading: true,
    });

    try {
      const result = await codeApi.executeCode<ExecutionResult>(
        file.name,
        source,
      );

      store.removeOutput(loadingId);

      store.setExecutionResult(fileId, result);

      return result;
    } catch (err) {
      store.removeOutput(loadingId);

      const error: ExecutionError = {
        id: crypto.randomUUID(),
        error: err instanceof Error ? err.message : "Failed to execute code",
      };

      store.addOutput(error);

      return error;
    }
  },
};
