import * as codeApi from "@/lib/api/codeApi";
import { useCodestore } from "../Codestore";
import type { CodeActions, ExecutionResult, ExecutionError } from "./types";

export const useCodeActions: CodeActions = {
  async loadFile(roomId: string, fileId: string): Promise<void> {
    const store = useCodestore.getState();

    const cache = store.code[fileId];

    // Already loaded or currently loading
    if (cache?.loaded || cache?.loading) {
      return;
    }

    store.setLoading(fileId, true);

    try {
      const data = await codeApi.fetchFile(roomId, fileId);

      store.setLoadedFile(fileId, data);
    } catch (err: unknown) {
      store.setLoadFileError(
        fileId,
        err instanceof Error ? err.message : "Failed to load file",
      );
    } finally {
      store.setLoading(fileId, false);
    }
  },

  async saveFile(
    roomId: string,
    fileId: string,
    content: string,
  ): Promise<void> {
    const store = useCodestore.getState();

    const file = store.code[fileId];

    if (!file || file.isDeleted) {
      return;
    }

    // Nothing changed
    if (file.savedContent === file.content) {
      return;
    }

    store.setFileEdited(fileId, true);
    store.setSaving(fileId, true);

    try {
      await codeApi.persistFile(roomId, fileId, content);

      store.setSavedFile(fileId, content);
    } catch (err: unknown) {
      store.setSavedFileError(
        fileId,
        err instanceof Error ? err.message : "Failed to save file",
      );
    } finally {
      store.setSaving(fileId, false);
    }
  },

  async runCode(
    fileId: string,
  ): Promise<ExecutionResult | ExecutionError | undefined> {
    const store = useCodestore.getState();

    const file = store.openFiles.find((f) => f._id === fileId);

    if (!file) {
      return undefined;
    }

    const source = store.code[fileId]?.content;

    if (!source?.trim()) {
      const error: ExecutionError = {
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
      const result = await codeApi.executeCode(file.name, source);

      store.removeOutput(loadingId);

      console.log("execution result:", result);

      store.setExecutionResult(fileId, result);

      return result;
    } catch (err: unknown) {
      store.removeOutput(loadingId);

      const error: ExecutionError = {
        error: err instanceof Error ? err.message : "Failed to execute code",
      };

      store.addOutput(error);

      return error;
    }
  },

  async generateCode(prompt: string): Promise<string | undefined> {
    const store = useCodestore.getState();

    store.setGenerating(true);

    try {
      const generated = await codeApi.requestGeneration(prompt);

      const content = generated?.response;

      if (!content) {
        throw new Error("AI returned an empty response");
      }

      store.addMessage({
        id: crypto.randomUUID(),
        name: "codesync AI",
        img: null,
        msg: content,
        role: "assistant",
      });

      return content;
    } catch (err: unknown) {
      console.error(err);

      store.setGeneratedError(
        err instanceof Error ? err.message : "Failed to generate code",
      );

      return undefined;
    } finally {
      store.setGenerating(false);
    }
  },
};
