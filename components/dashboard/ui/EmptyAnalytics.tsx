import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";

interface Props {
  isDark: boolean;
}

export function EmptyAnalytics({ isDark }: Props) {
  const s = isDark;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border p-10 mb-10"
      style={{
        background: s ? "#11182780" : "#ffffff",
        borderColor: s ? "#ffffff10" : "#e5e7eb",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Animated graph */}

      <svg
        viewBox="0 0 700 180"
        className="absolute inset-0 w-full h-full opacity-20"
      >
        <motion.path
          d="M0 140 C100 110 160 150 250 95 C340 45 430 120 520 70 C610 25 650 80 700 35"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {[120, 250, 380, 520].map((x) => (
          <motion.circle
            key={x}
            cx={x}
            cy="90"
            r="4"
            fill="#60A5FA"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: x / 500,
            }}
          />
        ))}
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: "#3B82F620",
          }}
        >
          <BarChart3 size={38} color="#3B82F6" />
        </motion.div>

        <h2
          className="text-2xl font-bold mb-3"
          style={{
            color: s ? "#F8FAFC" : "#111827",
          }}
        >
          No analytics available
        </h2>

        <p
          className="max-w-lg text-sm leading-7"
          style={{
            color: s ? "#94A3B8" : "#64748B",
          }}
        >
          Your workspace doesn't have any rooms yet. Create your first
          collaborative room to start tracking projects, members, and activity.
        </p>
      </div>
    </motion.div>
  );
}
