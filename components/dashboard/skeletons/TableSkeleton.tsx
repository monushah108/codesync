import { motion } from "motion/react";

interface Props {
  rows?: number;
  isDark: boolean;
}

export default function TableSkeleton({ rows = 6, isDark }: Props) {
  const s = isDark;

  return (
    <>
      {/* Header */}
      <div
        className="hidden md:grid grid-cols-[60px_1.5fr_180px_180px_90px] px-5 py-3"
        style={{
          background: s ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)",
          borderBottom: `1px solid ${
            s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"
          }`,
        }}
      >
        {["#", "Room Name", "Members", "Last Opened", ""].map((_, i) => (
          <div
            key={i}
            className="h-3 w-16 rounded-md animate-pulse"
            style={{
              background: s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            }}
          />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: index * 0.05,
            }}
            className="hidden md:grid grid-cols-[60px_1.5fr_180px_180px_90px] items-center px-5 py-4"
          >
            {/* Number */}
            <div
              className="h-3 w-6 rounded animate-pulse"
              style={{
                background: s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              }}
            />

            {/* Room */}
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg animate-pulse"
                style={{
                  background: s
                    ? "rgba(99,102,241,0.15)"
                    : "rgba(99,102,241,0.10)",
                }}
              />

              <div className="space-y-2">
                <div
                  className="h-3 w-28 rounded animate-pulse"
                  style={{
                    background: s
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  }}
                />

                <div
                  className="h-2.5 w-16 rounded animate-pulse"
                  style={{
                    background: s
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)",
                  }}
                />
              </div>
            </div>

            {/* Members */}
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 animate-pulse"
                  style={{
                    borderColor: s ? "#09090B" : "#fff",
                    background: s
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                  }}
                />
              ))}
            </div>

            {/* Last opened */}
            <div
              className="h-3 w-24 rounded animate-pulse"
              style={{
                background: s ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              }}
            />

            {/* Button */}
            <div className="flex justify-end">
              <div
                className="h-8 w-16 rounded-lg animate-pulse"
                style={{
                  background: s
                    ? "rgba(99,102,241,0.15)"
                    : "rgba(99,102,241,0.10)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
