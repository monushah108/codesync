import { create } from "zustand";

export const useNotifystore = create((set, get) => {
  return {
    cache: {},

    LoadNotify: (data) =>
      set((state) => {
        const unreadCount = data.filter((n) => !n.isRead).length;
        return {
          cache: {
            ...state.cache,
            data: data || [],
            unreadCount,
            loading: false,
            loaded: true,
          },
        };
      }),

    addNotify: (payload) =>
      set((state) => {
        if (state.cache.data.some((n) => n._id === payload._id)) return state;
        const data = [...(state.cache.data || []), payload];

        return {
          cache: {
            ...state.cache,
            data,
            unreadCount: data.filter((n) => !n.isRead).length,
          },
        };
      }),
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
                isRead: action === "read" ? true : n.isRead,
                message:
                  action === "read"
                    ? n.message
                    : `Your ${n.type} was ${action}.`,
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

    removeNotify({ id }) {
      set((state) => {
        const data = state.cache.data.filter((n) => n._id !== id);

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
