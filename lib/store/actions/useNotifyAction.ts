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
    const store = useNotifystore.getState();

    const previous = store.cache.data.find((n) => n._id === payload.id);

    store.updateNotify(payload);

    try {
      await notifyApi.updateNotify(payload);

      store.removeNotify({ id: payload.id });
    } catch (err) {
      store.restoreNotify(previous);
    }
  },
};
