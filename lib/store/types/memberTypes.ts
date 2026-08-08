// member

export type MemberRole = "owner" | "admin" | "member";

export interface Member {
  _id: string;
  userId: string;
  roomId: string;

  name: string;
  avatar?: string;

  role: MemberRole;

  isLive?: boolean;
  banned?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  avatar?: string;
}

export interface MemberStore {
  data: Record<string, Member[]>;

  user: User | null;

  loading: boolean;

  error: string | null;

  setUser: (user: User | null) => void;

  loadMembers: (members: Record<string, Member[]>) => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  addMembers: (roomId: string, member: Member) => void;

  setMemberLive: (roomId: string, memberId: string, isLive: boolean) => void;

  updateRole: (roomId: string, memberId: string, role: MemberRole) => void;

  restoreMember: (roomId: string, memberId: string) => void;

  banMember: (roomId: string, memberId: string) => void;

  removeMember: (roomId: string, memberId: string) => void;
}
