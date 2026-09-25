import { FolderResponse } from "@/lib/api/explorerApi";
import {
  ExplorerFile,
  ExplorerFolder,
  FolderCache,
} from "../types/explorerTypes";
import { CodeOutput } from "../types/codeTypes";

export interface ExplorerActionsMethods {
  loadFolder: (
    roomId: string,
    parentId: string,
  ) => Promise<FolderCache | FolderResponse | undefined>;

  addFolder: (
    roomId: string,
    parentId: string,
    name: string,
  ) => Promise<ExplorerFolder | undefined>;

  addFile: (
    roomId: string,
    parentId: string,
    name: string,
  ) => Promise<ExplorerFile | undefined>;

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
}

export interface ExecutionResult {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  error?: string;
  exitCode?: number;
  executionTime?: number;
  status?: {
    id: number;
    description: string;
  };
}

export interface ExecutionError extends CodeOutput {
  error: string;
}

// member action
import type {
  NotificationAction,
  NotificationCategory,
  NotificationFilter,
  NotificationType,
  RealtimeNotificationPayload,
} from "../types/notificationTypes";
import type { MemberData } from "@/lib/api/memberApi";

export type MemberRole = "owner" | "editor" | "viewer" | "admin" | "member";

export interface Member {
  _id: string;
  userId: string;
  roomId?: string;
  name: string;
  email?: string;
  image?: string;
  role: MemberRole;
  banned?: boolean;
  isOwner?: boolean;
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
  loadMembers: (roomId: string) => Promise<void>;
  LoadMembers?: (roomId?: string) => Promise<void>;

  changeRole: (
    roomId: string,
    member: MemberData | Member,
    role: "editor" | "viewer",
  ) => Promise<boolean>;

  toggleBan: (
    roomId: string,
    member: MemberData | Member,
  ) => Promise<boolean>;

  ban?: (roomId: string, memberId: string) => Promise<void>;

  removeMember: (
    roomId: string,
    member: MemberData | Member,
  ) => Promise<boolean>;

  remove?: (roomId: string, memberId: string) => Promise<void>;
}

// notification actions

export interface NotificationActionsMethods {
  info: (
    title: string,
    message: string,
    source?: string,
    category?: NotificationCategory,
    actions?: NotificationAction[],
  ) => string;

  success: (
    title: string,
    message: string,
    source?: string,
    category?: NotificationCategory,
    actions?: NotificationAction[],
  ) => string;

  warning: (
    title: string,
    message: string,
    source?: string,
    category?: NotificationCategory,
    actions?: NotificationAction[],
  ) => string;

  error: (
    title: string,
    message: string,
    source?: string,
    category?: NotificationCategory,
    actions?: NotificationAction[],
  ) => string;

  system: (
    title: string,
    message: string,
    actions?: NotificationAction[],
  ) => string;

  handleRealtimeEvent: (payload: RealtimeNotificationPayload) => string | null;

  memberJoined: (
    userName: string,
    userId?: string,
    currentUserId?: string,
  ) => void;

  memberLeft: (
    userName: string,
    userId?: string,
    currentUserId?: string,
  ) => void;

  memberRoleUpdated: (
    memberName: string,
    newRole: "owner" | "editor" | "viewer",
    isSelf: boolean,
  ) => void;

  memberKickedOrBanned: (
    memberName: string,
    reason: "banned" | "removed",
    isSelf: boolean,
  ) => void;

  fileSavedRemotely: (fileName: string) => void;

  connectionStateChanged: (
    state: "connected" | "disconnected" | "reconnecting",
  ) => void;

  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
  toggleCenter: () => void;
  setCenterOpen: (open: boolean) => void;
  dismissToast: () => void;
  setFilter: (filter: NotificationFilter) => void;
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

  renameRoom: (id: string, newName: string) => Promise<void>;

  deleteRoom: (id: string) => Promise<void>;

  leaveRoom: (id: string) => Promise<void>;
}

