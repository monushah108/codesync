import { BookOpen, ChevronDown, LogOut, Settings, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
const profileItems = [
  { icon: <User size={13} />, label: "Profile" },
  { icon: <Settings size={13} />, label: "Settings" },
  { icon: <BookOpen size={13} />, label: "My Rooms" },
];

export default function ProfileMenu({ isDark }: { isDark: boolean }) {
  const [open, setOpen] = useState(false);
  const s = isDark;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl outline-none"
          style={{
            background: s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            border: `1px solid ${s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            MO
          </div>
          <span
            className="text-sm hidden sm:block"
            style={{ color: s ? "#E2E8F0" : "#1E293B", fontWeight: 500 }}
          >
            Monu
          </span>
          <ChevronDown
            size={13}
            style={{
              color: s ? "#64748B" : "#94A3B8",
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "transform 0.2s",
            }}
          />
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
                className="z-50 w-52 rounded-2xl overflow-hidden"
                style={{
                  background: s
                    ? "rgba(15,23,42,0.95)"
                    : "rgba(255,255,255,0.98)",
                  border: `1px solid ${s ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0.09)"}`,
                  boxShadow: s
                    ? "0 20px 60px rgba(0,0,0,0.5)"
                    : "0 20px 60px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Profile header */}
                <div
                  className="px-4 py-3"
                  style={{
                    borderBottom: `1px solid ${s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      }}
                    >
                      MO
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: s ? "#F8FAFC" : "#0F172A" }}
                      >
                        Monu Kumar
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: s ? "#64748B" : "#94A3B8" }}
                      >
                        monu@codex.dev
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  {profileItems.map((item) => (
                    <DropdownMenu.Item
                      key={item.label}
                      className="outline-none cursor-pointer"
                    >
                      <div
                        className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                        style={{ color: s ? "#E2E8F0" : "#1E293B" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = s
                            ? "rgba(99,102,241,0.1)"
                            : "rgba(99,102,241,0.06)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span style={{ color: "#6366F1" }}>{item.icon}</span>
                        {item.label}
                      </div>
                    </DropdownMenu.Item>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: `1px solid ${s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                  }}
                  className="py-1"
                >
                  <DropdownMenu.Item className="outline-none cursor-pointer">
                    <div
                      className="flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
                      style={{ color: "#EF4444" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(239,68,68,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <LogOut size={13} /> Logout
                    </div>
                  </DropdownMenu.Item>
                </div>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
