export type Room = {
  _id?: string;
  name: string;
  tags: string[];
  adminId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RoomStore = {
  rooms: Room[];
  deletedRooms: Room[];
  shareLinks: Record<string, string>;

  loading: boolean;
  error: string | null;

  LoadRooms: (data: Room[]) => void;
  addRoom: (payload: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  renameRoom: (roomId: string, newName: string) => void;

  deleteRoom: (roomId: string) => void;

  generateShareLink: (roomId: string, token: string) => string;

  restoreRoom: (roomId: string) => void;
};
