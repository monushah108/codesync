//notify
export type NotificationAction = "accepted" | "declined" | "read" | null;

export interface Notification {
  _id: string;

  senderId: string;
  receiverId: string;

  senderName: string;

  roomId: string;
  roomName: string;

  action: NotificationAction;

  readAt: string | null;

  createdAt: string;
  updatedAt?: string;
}

export interface NotificationCache {
  data: Notification[];

  unreadCount: number;

  loading: boolean;

  loaded: boolean;

  error: string | null;
}

export interface NotificationStore {
  cache: NotificationCache;

  LoadNotify: (data: Notification[]) => void;

  addNotify: (notification: Notification) => void;

  setNotifyPending: (pending: boolean) => void;

  setNotifyError: (error: string | null) => void;

  markAsRead: (id: string) => void;

  restoreNotify: (notification: Notification) => void;

  updateNotify: (payload: { id: string; action: NotificationAction }) => void;

  removeNotify: (payload: { id: string }) => void;
}
