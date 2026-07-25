import { Monitor, Moon, Sun } from "lucide-react";
import { ReactNode } from "react";
import { motion } from "motion/react";
// --- Segmented Theme Toggle ---
export type Theme = "dark" | "light" | "system";

const themeOpts: { value: Theme; icon: ReactNode; label: string }[] = [
  { value: "light", icon: <Sun size={13} />, label: "Light" },
  { value: "dark", icon: <Moon size={13} />, label: "Dark" },
  { value: "system", icon: <Monitor size={13} />, label: "System" },
];

export function ThemeToggle({
  theme,
  onThemeChange,
  isDark,
}: {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  isDark: boolean;
}) {
  return (
    <div
      className="flex items-center p-0.5 rounded-xl gap-0.5"
      style={{
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      }}
    >
      {themeOpts.map((opt) => {
        const active = theme === opt.value;
        return (
          <motion.button
            key={opt.value}
            onClick={() => onThemeChange(opt.value)}
            whileTap={{ scale: 0.92 }}
            title={opt.label}
            className="relative flex items-center justify-center w-7 h-6 rounded-lg outline-none cursor-pointer"
            style={{ transition: "color 0.15s" }}
          >
            {active && (
              <motion.div
                layoutId="theme-pill"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: isDark
                    ? "rgba(99,102,241,0.2)"
                    : "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.35)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className="relative z-10"
              style={{
                color: active ? "#818CF8" : isDark ? "#64748B" : "#94A3B8",
              }}
            >
              {opt.icon}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
