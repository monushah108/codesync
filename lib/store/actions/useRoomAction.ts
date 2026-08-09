import { useRoomStore } from "../Roomstore";
import * as RoomApi from "@/lib/api/roomApi";
import { RoomActionsMethods } from "./types";

export const RoomActions: RoomActionsMethods = {
  async loadRooms(): Promise<void> {
    const store = useRoomStore.getState();

    if (store.loading) return;

    store.setLoading(true);

    try {
      const rooms = await RoomApi.GetRooms();

      store.LoadRooms(rooms);
      store.setError(null);
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to load rooms",
      );
    } finally {
      store.setLoading(false);
    }
  },

  async renameRoom(id: string, newName: string): Promise<void> {
    const store = useRoomStore.getState();

    try {
      await RoomApi.RenameRoom({
        id,
        newName,
      });

      store.renameRoom(id, newName);
    } catch (err: unknown) {
      store.setError(
        err instanceof Error ? err.message : "Failed to rename room",
      );

      store.restoreRoom(id);
    }
  },

  async deleteRoom(id: string): Promise<void> {
    const store = useRoomStore.getState();

    try {
      await RoomApi.DeleteRoom(id);

      store.deleteRoom(id);
      store.setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete room";

      store.setError(message);

      throw err;
    }
  },
};
