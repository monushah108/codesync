import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, PackageOpen, Users, X } from "lucide-react";
import { useNotifystore } from "@/lib/store/Notifystore";
import { useNotifyActions } from "@/lib/store/actions/useNotifyAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import useNotifySocket from "@/lib/hooks/useNotifySocket";

export function NotifBell({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const s = isDark;
  const cache = useNotifystore((state) => state.cache);
  const data = cache?.data || [];
  const loading = cache?.loading;
  const unread = cache?.unreadCount || 0;

  const { notifyOperation } = useNotifySocket();
  console.log(data);
  useEffect(() => {
    getNotifies();
  }, []);

  const getNotifies = async () => {
    await useNotifyActions.loadNotify();
  };

  const handleNotify = async (id, action) => {
    const notification = data.find((n) => n._id === id);

    if (!notification) return;

    await useNotifyActions.updateNotify({
      id,
      action,
    });

    notifyOperation(notification.senderId, {
      id,
      action,
      roomId: notification.roomId,
      senderId: notification.receiverId,
      receiverId: notification.senderId,
    });
  };

  const handleRead = async (id: string) => {
    await useNotifyActions.markViewNotify(id);
    /* TODO:scroll view has an error */
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex items-center justify-center w-8 h-8 rounded-xl outline-none"
          style={{
            background: s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <Bell size={15} style={{ color: s ? "#64748B" : "#94A3B8" }} />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "#EF4444" }}
            >
              {unread}
            </span>
          )}
        </motion.button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={10} align="end">
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="z-50 w-72 rounded-2xl overflow-hidden"
                style={{
                  background: s
                    ? "rgba(15,23,42,0.95)"
                    : "rgba(255,255,255,0.98)",
                  border: `1px solid ${s ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0.09)"}`,
                  boxShadow: s
                    ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)"
                    : "0 20px 60px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div
                  className="px-4 pt-3 pb-2 flex items-center justify-between"
                  style={{
                    borderBottom: `1px solid ${s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <span
                    className="text-xs font-semibold tracking-wider uppercase"
                    style={{ color: s ? "#94A3B8" : "#64748B" }}
                  >
                    Notifications
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      color: "#818CF8",
                    }}
                  >
                    {unread} new
                  </span>
                </div>

                {loading ? (
                  <div className="p-3 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl p-3 animate-pulse"
                      >
                        <div className="h-2 w-2 rounded-full bg-muted" />

                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-muted" />
                          <div className="h-3 w-1/3 rounded bg-muted" />

                          <div className="flex gap-2 pt-2">
                            <div className="h-8 w-20 rounded bg-muted" />
                            <div className="h-8 w-20 rounded bg-muted" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data.length === 0 ? (
                  <div className="flex h-44 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted/50">
                      <PackageOpen className="h-7 w-7 text-muted-foreground" />
                    </div>

                    <h3 className="text-sm font-semibold text-foreground">
                      No notifications
                    </h3>

                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      You're all caught up. New invitations and activity will
                      appear here.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[380px] pr-2">
                    <div className="py-1">
                      {data.map((n) => (
                        <DropdownMenu.Item
                          key={n._id}
                          className="outline-none cursor-pointer"
                        >
                          <div
                            onClick={() => handleRead(n._id)}
                            className="flex items-start gap-3 px-4 py-2.5 transition-colors"
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = s
                                ? "rgba(255,255,255,0.03)"
                                : "rgba(0,0,0,0.02)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <div
                              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-muted/50 ${
                                !n.readAt ? "bg-indigo-500/5" : ""
                              }`}
                            >
                              {/* Unread Indicator */}
                              {!n.readAt && (
                                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-indigo-500" />
                              )}

                              {/* Avatar / Icon */}
                              <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                                <Users size={16} />
                              </div>

                              {/* Content */}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <p className="truncate text-sm leading-5">
                                    <span className="font-semibold text-foreground">
                                      {n.senderName}
                                    </span>{" "}
                                    <span className="text-muted-foreground">
                                      invited you to{" "}
                                    </span>
                                    <span className="font-medium">
                                      {n.roomName}
                                    </span>
                                  </p>

                                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                    2m
                                  </span>
                                </div>

                                {!n.action && (
                                  <div className="mt-2 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 rounded-lg px-3 text-xs"
                                    >
                                      Decline
                                    </Button>

                                    <Button
                                      size="sm"
                                      className="h-7 rounded-lg px-3 text-xs"
                                    >
                                      Accept
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
