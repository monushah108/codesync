import type * as Y from "yjs";
import { useCodestore } from "@/lib/store/Codestore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import { downloadFile } from "@/lib/api/explorerApi";
import { toast } from "sonner";

interface RegisterKeybindingsOptions {
  editor: any;
  monaco: any;
  undoManager: Y.UndoManager;
  roomId: string;
  activeFileId: string | null;
  yText: Y.Text;
  setWordWrap: React.Dispatch<React.SetStateAction<"on" | "off">>;
  isViewer: boolean;
  isDisposed: () => boolean;
  onOpenAiPrompt?: () => void;
}

// Register undo/redo, save, download, preview toggle, and word-wrap keybindings
export function registerEditorKeybindings({
  editor,
  monaco,
  undoManager,
  roomId,
  activeFileId,
  yText,
  setWordWrap,
  isViewer,
  isDisposed,
  onOpenAiPrompt,
}: RegisterKeybindingsOptions) {
  if (!isViewer) {
    // Ctrl+Z (Undo)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      if (isDisposed()) return;
      undoManager.undo();
    });

    // Ctrl+Shift+Z / Ctrl+Y (Redo)
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
      () => {
        if (isDisposed()) return;
        undoManager.redo();
      },
    );

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      if (isDisposed()) return;
      undoManager.redo();
    });

    // Register in Monaco Command Palette / Context Menu
    editor.addAction({
      id: "collaborative-undo",
      label: "Undo",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ],
      run: () => {
        if (!isDisposed()) undoManager.undo();
      },
    });

    editor.addAction({
      id: "collaborative-redo",
      label: "Redo",
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyZ,
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY,
      ],
      run: () => {
        if (!isDisposed()) undoManager.redo();
      },
    });

    // Ctrl+S (Save)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (isDisposed() || !activeFileId) return;
      await useCodeActions.saveFile(roomId, activeFileId, yText.toString());
    });

    // Tell AI / Inline Edit: Ctrl+K / Cmd+K
    if (onOpenAiPrompt) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
        if (isDisposed()) return;
        onOpenAiPrompt();
      });

      editor.addAction({
        id: "tell-ai-edit",
        label: "✨ Tell AI / Edit Code",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
        contextMenuGroupId: "1_modification",
        contextMenuOrder: 0.1,
        run: () => {
          if (!isDisposed()) onOpenAiPrompt();
        },
      });
    }
  }

  // Download File: Ctrl+Alt+S / Cmd+Alt+S and Monaco Context Menu action
  editor.addAction({
    id: "download-active-file",
    label: "Download File",
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyS,
    ],
    contextMenuGroupId: "9_cutcopypaste",
    contextMenuOrder: 4,
    run: async () => {
      if (isDisposed() || !activeFileId) return;
      const file = useCodestore
        .getState()
        .openFiles.find((f) => f._id === activeFileId);
      if (!file) return;

      const toastId = toast.loading(`Preparing ${file.name}...`);
      try {
        await downloadFile(roomId, file._id, file.name, yText.toString());
        toast.success(`Downloaded ${file.name}!`, { id: toastId });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to download file";
        toast.error(message, { id: toastId });
      }
    },
  });

  // Toggle word wrap: Alt+Z
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyZ, () => {
    const next =
      editor.getOption(monaco.editor.EditorOption.wordWrap) === "on"
        ? "off"
        : "on";
    editor.updateOptions({ wordWrap: next });
    setWordWrap(next);
  });

  // Toggle Preview: Ctrl+Shift+V or Cmd+Shift+V
  editor.addAction({
    id: "toggle-editor-preview",
    label: "Toggle Preview",
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyV,
    ],
    contextMenuGroupId: "navigation",
    contextMenuOrder: 1.5,
    run: () => {
      if (!isDisposed()) {
        useLayoutstore.getState().togglePanel("preview");
      }
    },
  });
}
