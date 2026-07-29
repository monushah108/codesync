import * as notifyApi from "@/lib/api/notifyApi";
import { useNotifystore } from "../Notifystore";

export const useNotifyActions = {
  loadNotify: async () => {
    const store = useNotifystore.getState();
    try {
      store.setNotifyPending(true);
      const data = await notifyApi.fetchNotify();

      store.LoadNotify(data);
    } catch (err) {
      store.setNotifyError(err.message);
    } finally {
      store.setNotifyPending(false);
    }
  },

  sendNotify: async (payload) => {
    const store = useNotifystore.getState();
    try {
      const { data } = await notifyApi.sendNotify(payload);

      store.addNotify(data);
    } catch (err) {
      store.setNotifyError(err.message);
    }
  },

  updateNotify: async (payload) => {
    console.log("action ", payload);
    const store = useNotifystore.getState();

    const previous = store.cache.data.find((n) => n._id === payload.id);

    store.updateNotify(payload);

    try {
      await notifyApi.updateNotify(payload);

      store.removeNotify({ id: payload.id });
    } catch (err) {
      store.setNotifyError(err.message);
      store.restoreNotify(previous);
    }
  },

  markViewNotify: async (id: string) => {
    const store = useNotifystore.getState();

    const notification = store.cache.data.find((n) => n._id === id);

    if (!notification || notification.readAt) {
      return;
    }

    try {
      await notifyApi.updateNotify({
        id,
        action: "read",
      });

      store.markAsRead(id);
    } catch (err) {
      store.setNotifyError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read",
      );
    }
  },
};
