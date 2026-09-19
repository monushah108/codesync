import { create } from "zustand";

export type ActivePanel = "chat" | "preview" | "terminal" | "explorer" | null;

interface Panels {
  chat: boolean;
  preview: boolean;
  explorer: boolean;
  terminal: boolean;
}

type LayoutStore = {
  activePanel: ActivePanel;
  panels: Panels;

  openPanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: () => void;
  togglePanel: (panel: Exclude<ActivePanel, null>) => void;
};

export const useLayoutstore = create<LayoutStore>((set) => ({
  activePanel: "chat",

  panels: {
    chat: false,
    preview: false,
    explorer: false,
    terminal: false,
  },

  openPanel: (panel) => {
    set((state) => ({
      activePanel: panel,
      panels: {
        ...state.panels,
        [panel]: true,
      },
    }));
  },

  closePanel: () => {
    set({
      panels: {
        chat: false,
        preview: false,
        explorer: false,
        terminal: false,
      },
    });
  },

  togglePanel: (panel) => {
    set((state) => ({
      activePanel: panel,
      panels: {
        ...state.panels,
        [panel]: !state.panels[panel],
      },
    }));
  },
}));
