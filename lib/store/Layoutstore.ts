import { create } from "zustand";

export type ActivePanel = "chat" | "preview" | "terminal" | "explorer" | null;

type LayoutStore = {
  activePanel: ActivePanel;
  explorer: boolean;

  openPanel: (panel: Exclude<ActivePanel, null>) => void;
  closePanel: () => void;
  togglePanel: (panel: Exclude<ActivePanel, null>) => void;

  toggleExplorer: () => void;
};

export const useLayoutstore = create<LayoutStore>((set) => ({
  activePanel: null,
  explorer: true,

  openPanel: (panel) => {
    set({
      activePanel: panel,
    });
  },

  closePanel: () =>
    set({
      activePanel: null,
    }),

  togglePanel: (panel) => {
    set((state) => ({
      activePanel: state.activePanel === panel ? null : panel,
    }));
  },

  toggleExplorer: () =>
    set((state) => ({
      explorer: !state.explorer,
    })),
}));
