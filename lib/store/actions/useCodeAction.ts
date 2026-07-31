// lib/store/actions/useCodeAction.ts

import * as codeApi from "@/lib/api/codeApi";

import { useCodestore } from "../Codestore";
import { CodeActions } from "../types";

export const useCodeActions: CodeActions = {
  async loadFile(roomId, fileId) {
    const store = useCodestore.getState();

    const cache = store.code[fileId];

    // cache
    if (cache?.loaded || cache?.loading) return;

    store.setLoading(fileId, true);

    try {
      const data = await codeApi.fetchFile(roomId, fileId);

      store.setLoadedFile(fileId, data);
    } catch (err) {
      store.setLoadFileError(fileId, err.message);
    } finally {
      store.setLoading(fileId, false);
    }
  },

  async saveFile(roomId, fileId, content) {
    const store = useCodestore.getState();

    const file = store.code[fileId];

    if (!file || file.isDeleted) return;

    if (file.savedContent === file.content) return;

    store.setFileEdited(fileId, true);

    store.setSaving(fileId, true);

    try {
      await codeApi.persistFile(roomId, fileId, content);
      store.setSavedFile(fileId, content);
    } catch (err) {
      store.setSavedFileError(fileId, err.message);
    } finally {
      store.setSaving(fileId, false);
    }
  },

  async runCode(fileId) {
    const store = useCodestore.getState();

    const file = store.openFiles.find((f) => f._id === fileId);

    if (!file) return;

    const source = store.code[fileId]?.content;

    if (!source?.trim()) {
      store.addOutput({
        error: "No code to execute",
      });
      return;
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
    } catch {
      store.removeOutput(loadingId);

      const error = {
        error: "Failed to execute code",
      };

      store.addOutput(error);

      return error;
    }
  },

  async generateCode(prompt) {
    const store = useCodestore.getState();

    store.setGenerating(true);

    try {
      const generated = await codeApi.requestGeneration(prompt);

      return generated?.response;
      // return "hello";
    } catch (err) {
      console.error(err);
      store.setGeneratedError(err.message);
    } finally {
      store.setGenerating(false);
    }
  },
};
