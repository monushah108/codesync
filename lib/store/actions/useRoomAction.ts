import { useRoomStore } from "../Roomstore";
import * as RoomApi from "@/lib/api/roomApi";

export const RoomActions = {
  async loadRooms() {
    const store = useRoomStore.getState();

    store.setLoading(true);

    try {
      const rooms = await RoomApi.GetRooms();

      store.setRooms(rooms);

      store.setError(null);
    } catch (err) {
      store.setError(err.message || "Failed to load rooms");
    } finally {
      store.setLoading(false);
    }
  },

  // async deleteRoom(id: string) {
  //   const store = useRoomStore.getState();

  //   try {
  //     await RoomApi.deleteRoom(id);

  //     store.removeRoom(id);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  async renameRoom(id: string, newName: string) {
    const store = useRoomStore.getState();

    try {
      await RoomApi.RenameRoom({ id, newName });

      store.updateRoom(id, {
        newName,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
