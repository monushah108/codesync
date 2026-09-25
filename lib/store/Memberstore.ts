// lib/store/Memberstore.ts

import { create } from "zustand";
import type { MemberStore } from "./types/memberTypes";

export const useMemberStore = create<MemberStore>((set) => ({
  members: [],
  currentRole: null,
  isOwner: false,
  loading: false,
  actionLoadingId: null,
  error: null,

  setMembers: (members) =>
    set({
      members,
      error: null,
    }),

  setCurrentRole: (currentRole) =>
    set({
      currentRole,
      isOwner: currentRole === "owner",
    }),

  setIsOwner: (isOwner) => set({ isOwner }),

  setLoading: (loading) => set({ loading }),

  setActionLoadingId: (actionLoadingId) => set({ actionLoadingId }),

  setError: (error) => set({ error }),

  updateMemberRole: (memberId, role) =>
    set((state) => ({
      members: state.members.map((m) =>
        m._id === memberId ? { ...m, role } : m,
      ),
    })),

  updateMemberBanned: (memberId, banned) =>
    set((state) => ({
      members: state.members.map((m) =>
        m._id === memberId ? { ...m, banned } : m,
      ),
    })),

  removeMember: (memberId) =>
    set((state) => ({
      members: state.members.filter((m) => m._id !== memberId),
    })),

  reset: () =>
    set({
      members: [],
      currentRole: null,
      isOwner: false,
      loading: false,
      actionLoadingId: null,
      error: null,
    }),
}));

export const memberStore = useMemberStore;
