import { create } from "zustand";

export type PanelType = "chat" | "preview" | "terminal" | "explorer";
export type ActivePanel = PanelType | null;

export interface Panels {
  chat: boolean;
  preview: boolean;
  explorer: boolean;
  terminal: boolean;
}

export type QuickOpenMode = "open" | "find";

export type ConfirmModalOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "reload" | "leave" | "warning";
  warningNote?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type LayoutStore = {
  activePanel: ActivePanel;
  panels: Panels;
  isQuickOpen: boolean;
  quickOpenMode: QuickOpenMode;
  pendingEditorAction: "find" | null;
  confirmModal: ConfirmModalOptions | null;
  previewMode: "web" | "markdown" | null;
  setPreviewMode: (mode: "web" | "markdown" | null) => void;

  openPanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: (panel?: Exclude<ActivePanel, null>) => void;
  togglePanel: (panel: Exclude<ActivePanel, null>) => void;
  setPanel: (panel: Exclude<ActivePanel, null>, isOpen: boolean) => void;

  openQuickOpen: (mode?: QuickOpenMode) => void;
  closeQuickOpen: () => void;
  toggleQuickOpen: (mode?: QuickOpenMode) => void;
  setPendingEditorAction: (action: "find" | null) => void;

  showConfirmModal: (options: ConfirmModalOptions) => void;
  hideConfirmModal: () => void;
};

export const useLayoutstore = create<LayoutStore>((set) => ({
  activePanel: null,
  isQuickOpen: false,
  quickOpenMode: "open",
  pendingEditorAction: null,
  confirmModal: null,
  previewMode: null,
  setPreviewMode: (mode) => set({ previewMode: mode }),

  showConfirmModal: (options) => set({ confirmModal: options }),
  hideConfirmModal: () => set({ confirmModal: null }),

  panels: {
    chat: false,
    preview: false,
    explorer: true,
    terminal: false,
  },

  openPanel: (panel) => {
    set((state) => {
      if (panel === "chat") {
        return {
          activePanel: "chat",
          panels: {
            ...state.panels,
            chat: true,
            preview: false,
          },
        };
      }

      if (panel === "preview") {
        return {
          activePanel: "preview",
          panels: {
            ...state.panels,
            preview: true,
            chat: false,
          },
        };
      }

      return {
        activePanel: panel,
        panels: {
          ...state.panels,
          [panel]: true,
        },
      };
    });
  },

  closePanel: (panel) => {
    set((state) => {
      if (!panel) {
        return {
          activePanel: null,
          panels: {
            chat: false,
            preview: false,
            explorer: false,
            terminal: false,
          },
        };
      }

      const nextPanels = {
        ...state.panels,
        [panel]: false,
      };

      let nextActive = state.activePanel;
      if (state.activePanel === panel) {
        if (panel === "chat" && nextPanels.preview) nextActive = "preview";
        else if (panel === "preview" && nextPanels.chat) nextActive = "chat";
        else nextActive = null;
      }

      return {
        activePanel: nextActive,
        panels: nextPanels,
      };
    });
  },

  togglePanel: (panel) => {
    set((state) => {
      const isCurrentlyOpen = state.panels[panel];

      if (panel === "chat") {
        const nextChat = !isCurrentlyOpen;
        return {
          activePanel: nextChat ? "chat" : state.panels.preview ? "preview" : null,
          panels: {
            ...state.panels,
            chat: nextChat,
            preview: nextChat ? false : state.panels.preview,
          },
        };
      }

      if (panel === "preview") {
        const nextPreview = !isCurrentlyOpen;
        return {
          activePanel: nextPreview ? "preview" : state.panels.chat ? "chat" : null,
          panels: {
            ...state.panels,
            preview: nextPreview,
            chat: nextPreview ? false : state.panels.chat,
          },
        };
      }

      return {
        activePanel: !isCurrentlyOpen
          ? panel
          : state.activePanel === panel
            ? null
            : state.activePanel,
        panels: {
          ...state.panels,
          [panel]: !isCurrentlyOpen,
        },
      };
    });
  },

  setPanel: (panel, isOpen) => {
    set((state) => {
      if (panel === "chat") {
        return {
          activePanel: isOpen ? "chat" : state.panels.preview ? "preview" : null,
          panels: {
            ...state.panels,
            chat: isOpen,
            preview: isOpen ? false : state.panels.preview,
          },
        };
      }

      if (panel === "preview") {
        return {
          activePanel: isOpen ? "preview" : state.panels.chat ? "chat" : null,
          panels: {
            ...state.panels,
            preview: isOpen,
            chat: isOpen ? false : state.panels.chat,
          },
        };
      }

      return {
        activePanel: isOpen
          ? panel
          : state.activePanel === panel
            ? null
            : state.activePanel,
        panels: {
          ...state.panels,
          [panel]: isOpen,
        },
      };
    });
  },

  openQuickOpen: (mode = "open") =>
    set({
      isQuickOpen: true,
      quickOpenMode: mode,
    }),

  closeQuickOpen: () =>
    set({
      isQuickOpen: false,
    }),

  toggleQuickOpen: (mode = "open") =>
    set((state) => ({
      isQuickOpen: !state.isQuickOpen,
      quickOpenMode: mode,
    })),

  setPendingEditorAction: (action) =>
    set({
      pendingEditorAction: action,
    }),
}));

export const useLayoutStore = useLayoutstore;

