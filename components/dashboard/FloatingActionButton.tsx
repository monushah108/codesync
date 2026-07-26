import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-7 right-7 z-30 flex flex-col items-end gap-3">
      {/* Label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="px-3 py-1.5 rounded-xl text-sm font-medium text-white whitespace-nowrap pointer-events-none"
            style={{
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(99,102,241,0.3)",
              backdropFilter: "blur(12px)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Create Room
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white overflow-visible"
        style={{
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          boxShadow: hovered
            ? "0 0 0 8px rgba(99,102,241,0.12), 0 0 0 16px rgba(99,102,241,0.05), 0 8px 32px rgba(99,102,241,0.5)"
            : "0 4px 24px rgba(99,102,241,0.4)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Shine */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)",
          }}
        />
        <motion.div
          animate={{ rotate: hovered ? 90 : 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative z-10"
        >
          <Plus size={22} strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </div>
  );
}
