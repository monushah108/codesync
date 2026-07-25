import { motion } from "motion/react";
import { AnimatedLogo } from "./ui/Logo";
import { Theme, ThemeToggle } from "./ui/themeToggle";
import { NotifBell } from "./ui/notifyBell";
import ProfileMenu from "./ui/profileMenu";

interface HeaderProps {
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  isDark: boolean;
}

export function Header({ theme, onThemeChange, isDark }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40 w-full"
      style={{
        height: 70,
        background: isDark ? "rgba(9,9,11,0.82)" : "rgba(248,250,252,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <AnimatedLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle
            theme={theme}
            onThemeChange={onThemeChange}
            isDark={isDark}
          />
          <NotifBell isDark={isDark} />
          <ProfileMenu isDark={isDark} />
        </div>
      </div>
    </motion.header>
  );
}
