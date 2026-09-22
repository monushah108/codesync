import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomStore } from "./types/roomTypes";

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      rooms: [],
      deletedRooms: [],
      shareLinks: {},
      recentRoom: null,
      loading: false,
      error: null,

      LoadRooms: (data) =>
        set(() => ({
          rooms: data,
        })),

      setLoading: (loading) =>
        set({
          loading,
        }),

      setError: (error) =>
        set({
          error,
        }),

      addRoom: (payload) =>
        set((state) => ({
          rooms: [...state.rooms, payload],
        })),

      renameRoom: (roomId, newName) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room._id === roomId
              ? {
                ...room,
                name: newName,
              }
              : room,
          ),
        })),

      deleteRoom: (roomId) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room._id !== roomId),
        })),

      setRecentRoom: (room) =>
        set(() => ({
          recentRoom: room,
        })),

      restoreRoom: (roomId) =>
        set((state) => {
          const room = state.deletedRooms.find(
            (r) => r._id === roomId,
          );

          return room
            ? {
              rooms: [room, ...state.rooms],
              deletedRooms: state.deletedRooms.filter(
                (r) => r._id !== roomId,
              ),
            }
            : state;
        }),
    }),
    {
      name: "room-storage",

      partialize: (state) => ({
        recentRoom: state.recentRoom,
      }),
    },
  ),
);