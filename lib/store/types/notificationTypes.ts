// lib/store/types/notificationTypes.ts

export type NotificationType = "error" | "warning" | "info" | "success" | "system";

export type NotificationCategory =
  | "collaborator"
  | "room"
  | "file"
  | "terminal"
  | "chat"
  | "system"
  | "security";

export interface NotificationAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  category?: NotificationCategory;
  title: string;
  message: string;
  source?: string;
  timestamp: number;
  read: boolean;
  actions?: NotificationAction[];
  pinned?: boolean;
  metadata?: Record<string, unknown>;
}

export type NotificationFilter = "all" | "unread" | NotificationType | NotificationCategory;

export interface AddNotificationInput {
  id?: string;
  type: NotificationType;
  category?: NotificationCategory;
  title: string;
  message: string;
  source?: string;
  actions?: NotificationAction[];
  silentToast?: boolean;
  pinned?: boolean;
  metadata?: Record<string, unknown>;
}

export interface RealtimeNotificationPayload {
  event:
    | "member:join"
    | "member:leave"
    | "member:role-update"
    | "member:banned"
    | "member:kicked"
    | "file:saved"
    | "file:created"
    | "file:deleted"
    | "terminal:error"
    | "connection:status"
    | "custom";
  title: string;
  message: string;
  source?: string;
  severity?: NotificationType;
  category?: NotificationCategory;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
  silentToast?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  isOpen: boolean;
  activeToast: NotificationItem | null;
  filter: NotificationFilter;

  // Actions
  addNotification: (item: AddNotificationInput) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  dismissToast: () => void;
  setFilter: (filter: NotificationFilter) => void;
}
