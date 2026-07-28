import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ROW_ACTIONS } from "@/components/constant/dashboard";

export function RowMenu({
  onDelete,
  isDark,
}: {
  onDelete: () => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const s = isDark;
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-7 h-7 rounded-lg outline-none transition-colors"
          style={{
            background: open
              ? s
                ? "rgba(99,102,241,0.15)"
                : "rgba(99,102,241,0.1)"
              : "transparent",
            color: s ? "#475569" : "#94A3B8",
          }}
          onMouseEnter={(e) => {
            if (!open)
              (e.currentTarget as HTMLElement).style.background = s
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            if (!open)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <MoreHorizontal size={15} />
        </motion.button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={6} align="end">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -4 }}
                transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="z-50 w-44 rounded-xl overflow-hidden py-1"
                style={{
                  background: s
                    ? "rgba(15,23,42,0.96)"
                    : "rgba(255,255,255,0.98)",
                  border: `1px solid ${s ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.09)"}`,
                  boxShadow: s
                    ? "0 16px 40px rgba(0,0,0,0.5)"
                    : "0 16px 40px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {ROW_ACTIONS.map((a) => (
                  <DropdownMenu.Item
                    key={a.label}
                    className="outline-none cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors"
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
                      <span style={{ color: "#6366F1" }}>{a.icon}</span>
                      {a.label}
                    </div>
                  </DropdownMenu.Item>
                ))}
                <div
                  className="mx-2 my-1 h-px"
                  style={{
                    background: s
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                />
                <DropdownMenu.Item
                  onSelect={onDelete}
                  className="outline-none cursor-pointer"
                >
                  <div
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors"
                    style={{ color: "#EF4444" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(239,68,68,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash2 size={12} /> Delete
                  </div>
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
