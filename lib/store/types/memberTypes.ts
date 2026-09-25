// lib/store/types/memberTypes.ts

import type { MemberData, MemberRole } from "@/lib/api/memberApi";

export type { MemberData, MemberRole };

export interface MemberStoreState {
  members: MemberData[];
  currentRole: MemberRole | null;
  isOwner: boolean;
  loading: boolean;
  actionLoadingId: string | null;
  error: string | null;
}

export interface MemberStoreActions {
  setMembers: (members: MemberData[]) => void;
  setCurrentRole: (role: MemberRole) => void;
  setIsOwner: (isOwner: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActionLoadingId: (id: string | null) => void;
  setError: (error: string | null) => void;
  updateMemberRole: (memberId: string, role: "editor" | "viewer") => void;
  updateMemberBanned: (memberId: string, banned: boolean) => void;
  removeMember: (memberId: string) => void;
  reset: () => void;
}

export type MemberStore = MemberStoreState & MemberStoreActions;
