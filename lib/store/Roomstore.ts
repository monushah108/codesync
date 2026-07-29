import { create } from "zustand";
import { RoomStore } from "./types";

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],

  activeRoom: null,

  inviteRoomId: null,

  setRooms: (rooms) =>
    set({
      rooms,
    }),

  // Open Room
  openRoom: (room) =>
    set({
      activeRoom: room,
    }),

  // Rename
  renameRoom: (roomId, name) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              name,
            }
          : room,
      ),
    })),

  // Duplicate
  duplicateRoom: (roomId) =>
    set((state) => {
      const room = state.rooms.find((r) => r._id === roomId);

      if (!room) return state;

      const duplicate: Room = {
        ...room,
        _id: crypto.randomUUID(),
        name: `${room.name} Copy`,
        createdAt: new Date().toISOString(),
      };

      return {
        rooms: [duplicate, ...state.rooms],
      };
    }),

  // Delete
  deleteRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room._id !== roomId),
    })),

  // Invite Members
  setInviteRoom: (roomId) =>
    set({
      inviteRoomId: roomId,
    }),

  // Share Link
  generateShareLink: (roomId, token) => {
    const link = `${window.location.origin}/room/${token}`;

    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              shareLink: link,
            }
          : room,
      ),
    }));

    return link;
  },

  clearActiveRoom: () =>
    set({
      activeRoom: null,
    }),

  addMember: (roomId, member) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              members: [...room.members, member],
            }
          : room,
      ),
    })),

  removeMember: (roomId, memberId) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              members: room.members.filter((member) => member.id !== memberId),
            }
          : room,
      ),
    })),

  updateMemberRole: (roomId, memberId, role) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              members: room.members.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      role,
                    }
                  : member,
              ),
            }
          : room,
      ),
    })),

  setMembers: (roomId, members) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              members,
            }
          : room,
      ),
    })),

  getRoomMembers: (roomId) => {
    const room = get().rooms.find((room) => room._id === roomId);

    return room?.members ?? [];
  },
}));
