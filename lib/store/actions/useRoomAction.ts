import { useRoomStore } from "../Roomstore";
import * as RoomApi from "@/lib/api/roomApi";

export const RoomActions = {
  async loadRooms() {
    const store = useRoomStore.getState();

    store.setLoading(true);

    try {
      const rooms = await RoomApi.GetRooms();

      store.LoadRooms(rooms);

      store.setError(null);
    } catch (err) {
      store.setError(err.message || "Failed to load rooms");
    } finally {
      store.setLoading(false);
    }
  },

  async createRoom(payload) {
    const store = useRoomStore.getState();

    try {
      const room = await RoomApi.CreateRoom(payload);
      store.addRoom(room);
    } catch (err) {
      store.setError(err.message || "Failed to load rooms");
    }
  },

  async renameRoom(id: string, newName: string) {
    const store = useRoomStore.getState();

    try {
      await RoomApi.RenameRoom({ id, newName });

      store.updateRoom(id, {
        newName,
      });
    } catch (err) {
      store.setError(err.message || "Failed to load rooms");
      store.restoreRoom(id);
    }
  },
};
