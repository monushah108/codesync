"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Info,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NotificationItem,
  NotificationType,
  useNotificationStore,
} from "@/lib/store/Notificationstore";

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "error":
      return <AlertCircle className="size-3.5 shrink-0 text-red-400" />;
    case "warning":
      return <AlertTriangle className="size-3.5 shrink-0 text-amber-400" />;
    case "success":
      return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />;
    case "info":
    default:
      return <Info className="size-3.5 shrink-0 text-sky-400" />;
  }
}

function getNotificationBorderClass(type: NotificationType) {
  switch (type) {
    case "error":
      return "border-l-red-500 bg-red-500/[0.04]";
    case "warning":
      return "border-l-amber-500 bg-amber-500/[0.04]";
    case "success":
      return "border-l-emerald-500 bg-emerald-500/[0.04]";
    case "info":
    default:
      return "border-l-sky-500 bg-sky-500/[0.04]";
  }
}

/* ------------------------------------------------------------------
   FLOATING TOAST (VS CODE STYLE BOTTOM-RIGHT NOTIFICATION BANNER)
------------------------------------------------------------------ */
export function NotificationToast() {
  const activeToast = useNotificationStore((s) => s.activeToast);
  const dismissToast = useNotificationStore((s) => s.dismissToast);
  const toggleOpen = useNotificationStore((s) => s.toggleOpen);

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          key={activeToast.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`fixed bottom-9 right-3 z-50 flex w-[320px] sm:w-[350px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5 rounded-md border border-[#3c3c3c] border-l-4 bg-[#1e1e1e] p-2.5 text-xs text-[#cccccc] shadow-2xl backdrop-blur-md ${getNotificationBorderClass(
            activeToast.type,
          )}`}
        >
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {getNotificationIcon(activeToast.type)}
              <span className="font-medium text-[11px] text-white truncate">{activeToast.title}</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-400 shrink-0">
              <span className="text-[9px]">
                {formatRelativeTime(activeToast.timestamp)}
              </span>
              <button
                type="button"
                onClick={dismissToast}
                className="rounded p-0.5 hover:bg-white/10 hover:text-white"
                title="Dismiss"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>

          <p className="line-clamp-2 text-[10px] leading-relaxed text-neutral-300">
            {activeToast.message}
          </p>

          <div className="mt-0.5 flex items-center justify-between pt-1 border-t border-white/[0.06]">
            <span className="rounded bg-white/5 px-1 py-0.2 text-[9px] font-mono text-neutral-400">
              {activeToast.source}
            </span>
            <button
              type="button"
              onClick={() => {
                dismissToast();
                toggleOpen();
              }}
              className="text-[10px] text-sky-400 hover:text-sky-300 hover:underline"
            >
              View in Center
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------
   NOTIFICATION CENTER DRAWER
------------------------------------------------------------------ */
export function NotificationCenter() {
  const isOpen = useNotificationStore((s) => s.isOpen);
  const setOpen = useNotificationStore((s) => s.setOpen);
  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const counts = useMemo(() => {
    return {
      all: notifications.length,
      error: notifications.filter((n) => n.type === "error").length,
      warning: notifications.filter((n) => n.type === "warning").length,
      info: notifications.filter((n) => n.type === "info" || n.type === "success").length,
    };
  }, [notifications]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed bottom-9 right-3 z-50 flex h-auto max-h-[380px] w-[320px] sm:w-[350px] max-w-[calc(100vw-1.5rem)] flex-col rounded-lg border border-[#3c3c3c] bg-[#1e1e1e]/98 text-xs text-[#cccccc] shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-200"
        >
          {/* Compact Header */}
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] px-3 bg-[#252526]/90">
            <div className="flex items-center gap-1.5">
              <Bell className="size-3 text-neutral-400" />
              <span className="font-semibold text-[11px] text-white">Notifications</span>
              {notifications.length > 0 && (
                <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[9px] text-neutral-300">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Clear all notifications"
                >
                  <CheckCheck className="size-2.5" />
                  <span>Clear All</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Close"
              >
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills (only when > 2 notifications) */}
          {notifications.length > 2 && (
            <div className="flex shrink-0 items-center gap-1 border-b border-[#2d2d30] px-2.5 py-1 bg-[#1e1e1e]/60 text-[10px]">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded px-1.5 py-0.5 transition-colors ${
                  filter === "all"
                    ? "bg-[#007acc] text-white font-medium"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                All ({counts.all})
              </button>
              {counts.error > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("error")}
                  className={`rounded px-1.5 py-0.5 transition-colors ${
                    filter === "error"
                      ? "bg-red-500/80 text-white font-medium"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Errors ({counts.error})
                </button>
              )}
              {counts.warning > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("warning")}
                  className={`rounded px-1.5 py-0.5 transition-colors ${
                    filter === "warning"
                      ? "bg-amber-500/80 text-white font-medium"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Warnings ({counts.warning})
                </button>
              )}
              {counts.info > 0 && (
                <button
                  type="button"
                  onClick={() => setFilter("info")}
                  className={`rounded px-1.5 py-0.5 transition-colors ${
                    filter === "info"
                      ? "bg-sky-500/80 text-white font-medium"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Info ({counts.info})
                </button>
              )}
            </div>
          )}

          {/* Notifications List - dynamic height: starts small, grows as notifications appear, up to max-height */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 transition-[max-height] duration-200">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-4 px-2 text-center text-neutral-500 space-y-1">
                <Bell className="size-4 stroke-1 text-neutral-600" />
                <p className="text-[11px] font-medium text-neutral-400">
                  {filter === "all" ? "No notifications" : `No ${filter} notifications`}
                </p>
                {filter === "all" && (
                  <p className="text-[10px] text-neutral-500">
                    Workspace events and alerts will appear here.
                  </p>
                )}
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  item={n}
                  onDismiss={() => removeNotification(n.id)}
                />
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------
   SINGLE NOTIFICATION CARD
------------------------------------------------------------------ */
function NotificationCard({
  item,
  onDismiss,
}: {
  item: NotificationItem;
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.message.length > 100 || item.message.includes("\n");

  return (
    <div
      className={`group relative rounded border border-[#333333] border-l-4 bg-[#252526] p-2 transition-colors duration-100 hover:border-[#444444] ${getNotificationBorderClass(
        item.type,
      )}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {getNotificationIcon(item.type)}
          <span className="font-medium text-[11px] text-neutral-100 truncate">{item.title}</span>
          {item.source && (
            <span className="rounded bg-white/5 px-1 py-0.2 text-[9px] font-mono text-neutral-400 shrink-0">
              {item.source}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-neutral-400 shrink-0">
          <span className="text-[9px] whitespace-nowrap">
            {formatRelativeTime(item.timestamp)}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 hover:text-white transition-all"
            title="Clear"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>

      <div className="mt-1">
        <p
          className={`text-[10px] leading-relaxed text-neutral-300 ${
            !expanded && isLong ? "line-clamp-2" : "whitespace-pre-wrap"
          }`}
        >
          {item.message}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-0.5 text-[9px] text-sky-400 hover:text-sky-300 hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {item.actions && item.actions.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1 pt-1 border-t border-white/[0.06]">
          {item.actions.map((act) => (
            <button
              key={act.label}
              type="button"
              onClick={act.onClick}
              className={`rounded px-1.5 py-0.5 text-[9px] font-medium transition-colors ${
                act.primary
                  ? "bg-[#007acc] text-white hover:bg-[#0062a3]"
                  : "bg-white/10 text-neutral-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
