import { motion } from "motion/react";

interface Props {
  isDark: boolean;
  count?: number;
}

export function StatsCardsSkeleton({ isDark, count = 4 }: Props) {
  const s = isDark;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.08 }}
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: s ? "rgba(17,24,39,0.5)" : "rgba(255,255,255,0.85)",
            border: `1px solid ${
              s ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"
            }`,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Left Accent */}
          <div
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full animate-pulse"
            style={{
              background: s ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
            }}
          />

          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Label */}
              <div
                className="h-3 w-20 rounded animate-pulse mb-4"
                style={{
                  background: s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                }}
              />

              {/* Value */}
              <div
                className="h-9 w-14 rounded animate-pulse mb-4"
                style={{
                  background: s ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)",
                }}
              />

              {/* Subtitle */}
              <div
                className="h-3 w-28 rounded animate-pulse"
                style={{
                  background: s ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                }}
              />
            </div>

            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl animate-pulse"
              style={{
                background: s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
