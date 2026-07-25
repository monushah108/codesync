import { create } from "zustand";

export const useNotifystore = create((set, get) => {
  return {
    cache: {},

    LoadNotify: (data) =>
      set((state) => ({
        cache: {
          ...state.cache,
          data: data,
          laoding: false,
          loaded: true,
        },
      })),

    addNotify: (payload) =>
      set((state) => ({
        cache: {
          ...state.cache,
          data: [...(state.response.data || []), payload],
        },
      })),

    setNotifyPending: (pending) =>
      set((state) => ({
        cache: {
          ...state.cache,
          loading: pending,
          loaded: false,
          error: null,
        },
      })),

    setNotifyError: (err) =>
      set((state) => ({
        cache: {
          ...state.cache,
          loading: false,
          loaded: true,
          error: err,
        },
      })),

    clearNotify: () =>
      set(() => ({
        cache: {
          data: [],
          loading: false,
          loaded: true,
          error: null,
        },
      })),
  };
});
