export interface Room {
  _id: string;
  name: string;

  ownerId?: string;

  lastOpened?: string | null;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface RoomStore {
  rooms: Room[];

  deletedRooms: Room[];

  shareLinks: Record<string, string>;

  loading: boolean;

  error: string | null;

  LoadRooms: (data: Room[]) => void;

  addRoom: (room: Room) => void;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  renameRoom: (roomId: string, newName: string) => void;

  deleteRoom: (roomId: string) => void;

  generateShareLink: (roomId: string, token: string) => string;

  restoreRoom: (roomId: string) => void;
}
