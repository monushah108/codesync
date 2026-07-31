import { create } from "zustand";
import { RoomStore } from "./types";
import { useMemberStore } from "./Memberstore";

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  deletedRooms: [],
  shareLinks: {},
  loading: false,

  error: null,

  LoadRooms: (data) => {
    set((state) => ({
      rooms: data,
    }));
  },

  addRoom: (data) => {
    const members = useMemberStore.getState().data[data._id] ?? [];

    set((state) => ({
      rooms: [
        ...state.rooms,
        {
          ...data,
          members,
          lastOpened: null,
        },
      ],
    }));
  },

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  // Rename
  renameRoom: (roomId, newName) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              newName,
            }
          : room,
      ),
    })),

  // Delete
  deleteRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room._id !== roomId),
    })),

  // Share Link
  generateShareLink: (roomId, token) => {
    const link = `${window.location.origin}/share/${token}`;

    set((state) => ({
      shareLinks: {
        ...state.shareLinks,
        [roomId]: link,
      },
    }));

    return link;
  },

  restoreRoom: (roomId) =>
    set((state) => {
      const room = state.deletedRooms.find((r) => r._id === roomId);

      return room
        ? {
            rooms: [room, ...state.rooms],
            deletedRooms: state.deletedRooms.filter((r) => r._id !== roomId),
          }
        : state;
    }),
}));
