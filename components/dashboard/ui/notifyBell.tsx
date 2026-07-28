import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, PackageOpen, X } from "lucide-react";
import { useNotifystore } from "@/lib/store/Notifystore";
import { useNotifyActions } from "@/lib/store/actions/useNotifyAction";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function NotifBell({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const s = isDark;
  const cache = useNotifystore((state) => state.cache);
  const data = cache?.data || [];
  const unread = cache?.unreadCount || 0;
  console.log(data);
  useEffect(() => {
    getNotifies();
  }, []);

  const getNotifies = async () => {
    await useNotifyActions.loadNotify();
  };

  const handleNotify = async (id, action) => {
    const payload = {
      id,
      action,
    };

    await useNotifyActions.updateNotify(payload);
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

                {unread <= 0 ? (
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
                            <div className="mt-1.5 flex-shrink-0">
                              {!n.isRead ? (
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ background: "#6366F1" }}
                                />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full" />
                              )}
                            </div>

                            <div>
                              <p
                                className="text-sm"
                                style={{
                                  color: s ? "#F8FAFC" : "#0F172A",
                                  fontWeight: !n.isRead ? 500 : 400,
                                }}
                              >
                                {n.message}
                              </p>

                              <p
                                className="text-xs mt-0.5"
                                style={{ color: s ? "#64748B" : "#94A3B8" }}
                              >
                                {new Date(n.createdAt).toLocaleDateString(
                                  "de-DE",
                                )}
                              </p>

                              {!n.action && (
                                <div className="flex items-center  gap-2 pt-3">
                                  <Button
                                    variant="outline"
                                    size="xs"
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleNotify(n._id, "declined")
                                    }
                                  >
                                    <X className="mr-2 h-2 w-2" />
                                    Decline
                                  </Button>

                                  <Button
                                    onClick={() =>
                                      handleNotify(n._id, "accepted")
                                    }
                                    size="xs"
                                    className="cursor-pointer"
                                  >
                                    <Check className="mr-2 h-2 w-2" />
                                    Accept
                                  </Button>
                                </div>
                              )}

                              {n.action == "accepted" && (
                                <Button
                                  onClick={() => handleNotify(n._id, "join")}
                                  size="xs"
                                  className="cursor-pointer mt-2"
                                >
                                  join
                                </Button>
                              )}
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
