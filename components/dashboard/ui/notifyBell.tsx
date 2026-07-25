import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "motion/react";
import { Bell } from "lucide-react";
const notifs = [
  {
    id: "1",
    title: "Rahul joined Frontend Interview",
    time: "2m ago",
    unread: true,
  },
  { id: "2", title: "Aman shared a new room", time: "1h ago", unread: true },
  {
    id: "3",
    title: "System Design session started",
    time: "3h ago",
    unread: false,
  },
];

export function NotifBell({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const unread = notifs.filter((n) => n.unread).length;
  const s = isDark;

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
                <div className="py-1">
                  {notifs.map((n) => (
                    <DropdownMenu.Item
                      key={n.id}
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
                          {n.unread ? (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "#6366F1" }}
                            />
                          ) : (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: "transparent" }}
                            />
                          )}
                        </div>
                        <div>
                          <p
                            className="text-sm"
                            style={{
                              color: s ? "#F8FAFC" : "#0F172A",
                              fontWeight: n.unread ? 500 : 400,
                            }}
                          >
                            {n.title}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: s ? "#64748B" : "#94A3B8" }}
                          >
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenu.Item>
                  ))}
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
