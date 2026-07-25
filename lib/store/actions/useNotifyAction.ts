import * as notifyApi from "@/lib/api/notifyApi";
import { useNotifystore } from "../Notifystore";

export const useNotifyAction = {
  loadNotify: async () => {
    const store = useNotifystore.getState();
    try {
      store.setNotifyPending(true);
      const { data } = await notifyApi.fetchNotify();

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
};
