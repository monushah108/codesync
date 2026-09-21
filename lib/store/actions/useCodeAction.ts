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

    const cachedCode = store.code[fileId];
    const source = cachedCode?.content || cachedCode?.savedContent || "";

    if (!source.trim()) {
      const error: ExecutionError = {
        id: crypto.randomUUID(),
        error: "No code to execute. File is empty.",
      };

      store.addOutput(error);

      return error;
    }

    const loadingId = crypto.randomUUID();

    store.setRunning(fileId, true);

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

      // Handle cases where stdout is null or empty from Judge0, or execution status failed
      const isStatusError = Boolean(result.status && result.status.id > 3);
      const statusMessage = isStatusError
        ? `[${result.status?.description || "Execution Error"}]${result.message ? `: ${result.message}` : ""}`
        : undefined;

      const formattedResult: ExecutionResult = {
        ...result,
        stderr:
          result.stderr ||
          (!result.compile_output && isStatusError ? statusMessage : undefined),
        stdout:
          result.stdout ??
          (result.compile_output || result.stderr || isStatusError
            ? undefined
            : "✓ Program exited with code 0 (no output)"),
      };

      store.setExecutionResult(fileId, formattedResult);

      return formattedResult;
    } catch (err) {
      store.removeOutput(loadingId);

      const errorMessage =
        (err as { message?: string })?.message ||
        (err instanceof Error ? err.message : "Failed to execute code");

      const error: ExecutionError = {
        id: crypto.randomUUID(),
        error: errorMessage,
      };

      store.addOutput(error);

      return error;
    } finally {
      store.setRunning(fileId, false);
    }
  },
};
