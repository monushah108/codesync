import { useRoomStore } from "../Roomstore";
import * as RoomApi from "@/lib/api/roomApi";

export const RoomActions = {
  async loadRooms() {
    const store = useRoomStore.getState();

    try {
      const rooms = await RoomApi.getRooms();

      store.setRooms(rooms);

      return rooms;
    } catch (err) {
      console.log(err);
    }
  },

  async deleteRoom(id: string) {
    const store = useRoomStore.getState();

    try {
      await RoomApi.deleteRoom(id);

      store.removeRoom(id);
    } catch (err) {
      console.log(err);
    }
  },

  async renameRoom(id: string, name: string) {
    const store = useRoomStore.getState();

    try {
      await RoomApi.renameRoom(id, name);

      store.updateRoom(id, {
        name,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
