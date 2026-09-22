export type Room = {
  _id: string;
  name: string;
  tags: string[];
  adminId?: string;
  projectType: string;
  role?: "owner" | "editor" | "viewer";
  link?: string;
  isOwner?: boolean;
  lastActiveAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RoomStore = {
  rooms: Room[];
  deletedRooms: Room[];
  shareLinks: Record<string, string>;
  recentRoom: Room | null;

  loading: boolean;
  error: string | null;

  LoadRooms: (data: Room[]) => void;
  addRoom: (payload: Room) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  renameRoom: (roomId: string, newName: string) => void;

  deleteRoom: (roomId: string) => void;

  restoreRoom: (roomId: string) => void;

  setRecentRoom: (room: Room | null) => void;
};
