import { Code2, FolderOpen, Laptop, Terminal } from "lucide-react";
import { motion } from "motion/react";
// --- Empty State ---
export function EmptyState({
  onCreateRoom,
  isDark,
}: {
  onCreateRoom: () => void;
  isDark: boolean;
}) {
  const s = isDark;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="flex items-end gap-2 mb-8">
        {[
          { icon: <Laptop size={22} />, color: "#6366F1", delay: 0 },
          { icon: <Code2 size={22} />, color: "#8B5CF6", delay: 0.15 },
          { icon: <Terminal size={22} />, color: "#22C55E", delay: 0.3 },
          { icon: <FolderOpen size={22} />, color: "#F59E0B", delay: 0.45 },
        ].map((item, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: s ? `${item.color}14` : `${item.color}10`,
              border: `1px solid ${item.color}30`,
            }}
          >
            <span style={{ color: item.color }}>{item.icon}</span>
          </motion.div>
        ))}
      </div>
      <h3
        className="text-lg mb-2"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          color: s ? "#F8FAFC" : "#0F172A",
        }}
      >
        No rooms yet
      </h3>
      <p
        className="text-sm mb-8 max-w-xs leading-relaxed"
        style={{ color: s ? "#64748B" : "#94A3B8" }}
      >
        Create your first collaborative coding workspace and start building with
        your team.
      </p>
      <motion.button
        onClick={onCreateRoom}
        whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(99,102,241,0.5)" }}
        whileTap={{ scale: 0.96 }}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
        }}
      >
        + Create Room
      </motion.button>
    </motion.div>
  );
}
