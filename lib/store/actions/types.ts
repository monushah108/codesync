import { NotificationAction } from "../types/notifyTypes";

export interface ExplorerActionsMethods {
  loadFolder: (roomId: string, parentId?: string) => Promise<void>;

  addFolder: (roomId: string, parentId: string, name: string) => Promise<void>;

  addFile: (roomId: string, parentId: string, name: string) => Promise<void>;

  renameFolder: (
    roomId: string,
    parentId: string,
    folderId: string,
    newName: string,
  ) => Promise<void>;

  renameFile: (
    roomId: string,
    parentId: string,
    fileId: string,
    newName: string,
  ) => Promise<void>;

  deleteFolder: (
    roomId: string,
    parentId: string,
    folderId: string,
  ) => Promise<void>;

  deleteFile: (
    roomId: string,
    parentId: string,
    fileId: string,
  ) => Promise<void>;
}

// codeAction types
export interface CodeActions {
  loadFile: (roomId: string, fileId: string) => Promise<void>;

  saveFile: (roomId: string, fileId: string, content: string) => Promise<void>;

  runCode: (
    fileId: string,
  ) => Promise<ExecutionResult | ExecutionError | undefined>;

  generateCode: (prompt: string) => Promise<string | undefined>;
}

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  error?: string;
  exitCode?: number;
  executionTime?: number;
}

export interface ExecutionError {
  error: string;
}

// member action

export type MemberRole = "owner" | "admin" | "member";

export interface Member {
  _id: string;
  userId: string;
  roomId: string;
  name: string;
  role: MemberRole;
  banned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddMemberResponse {
  member: Member;
}

export interface UpdateRolePayload {
  memberId: string;
  role: MemberRole;
}

export interface BanMemberPayload {
  userId: string;
  banned: boolean;
}

export interface MemberActionsMethods {
  LoadMembers: () => Promise<void>;

  invite: (roomId: string, memberId: string) => Promise<Member | undefined>;

  changeRole: (
    roomId: string,
    memberId: string,
    role: MemberRole,
  ) => Promise<void>;

  ban: (roomId: string, memberId: string) => Promise<void>;

  remove: (roomId: string, memberId: string) => Promise<void>;
}

// rooms

export interface Room {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRoomPayload {
  name: string;
}

export interface RenameRoomPayload {
  id: string;
  newName: string;
}

export interface RoomLinkResponse {
  token: string;
}

export interface RoomActionsMethods {
  loadRooms: () => Promise<void>;

  createRoom: (payload: CreateRoomPayload) => Promise<void>;

  renameRoom: (id: string, newName: string) => Promise<void>;

  getRoomLink: (roomId: string) => Promise<string>;
}

//notify

export interface NotifyActionMethods {
  loadNotify: () => Promise<void>;

  sendNotify: (payload: unknown) => Promise<Notification | undefined>;

  updateNotify: (payload: {
    id: string;
    action: NotificationAction;
  }) => Promise<void>;

  markViewNotify: (id: string) => Promise<void>;
}
