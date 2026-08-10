type RoomCreatePayload = {
  roomId: string;
  user: User;
};

type RoomJoinPayload = {
  roomId: string;
  user: User;
};

type RoomLeavePayload = {
  roomId: string;
  user: User;
};

type YjsPayload = {
  roomId: string;
  fileId: string;
  update: number[] | Uint8Array | ArrayBuffer;
};

type AIChatPayload = {
  roomId: string;
  message: string;
  user: User;
};

export type User = {
  id: string;
  name: string;
  email?: string | null;
  image?: string | null;
};

export type Room = {
  roomId: string;
  adminId: string;
  members: Map<string, User>;
};

export type ConnectedUser = {
  roomId: string;
  user: User;
};

export type Activity = {
  id: string;
  userId: string;
  userName: string;
  type: string;
  time: string;
  message?: string;
  target?: string;
  fileName?: string;
};
