import { create } from "zustand";

export const useNotifystore = create((set, get) => {
  return {
    cache: {},

    LoadNotify: (data) =>
      set((state) => ({
        cache: {
          ...state.cache,
          data: data || [],
          unreadCount: data.filter((n) => !n.isRead).length,
          loading: false,
          loaded: true,
        },
      })),

    addNotify: (payload) =>
      set((state) => ({
        cache: {
          ...state.cache,
          data: [...(state.cache.data || []), payload],
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

    restoreNotify(notification) {
      set((state) => ({
        cache: {
          ...state.cache,
          data: state.cache.data.map((n) =>
            n._id === notification._id ? notification : n,
          ),
        },
      }));
    },

    updateNotify({ id, action }) {
      set((state) => {
        const data = state.cache.data.map((n) =>
          n._id == id
            ? {
                ...n,
                action,
                message: `your ${n.type} is ${action} `,
              }
            : n,
        );

        return {
          cache: {
            ...state.cache,
            data,
            unreadCount: data.filter((n) => !n.isRead).length,
          },
        };
      });
    },
  };
});
