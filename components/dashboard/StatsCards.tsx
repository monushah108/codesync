import { motion } from "motion/react";
import { cards } from "../constant/dashboard";

interface StatsCardsProps {
  isDark: boolean;
}

export function StatsCards({ isDark }: StatsCardsProps) {
  const s = isDark;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 * i + 0.15 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="relative rounded-2xl p-5 overflow-hidden group"
            style={{
              background: s ? "rgba(17,24,39,0.5)" : "rgba(255,255,255,0.85)",
              border: `1px solid ${s ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
              boxShadow: s
                ? "0 1px 0 rgba(255,255,255,0.03) inset"
                : "0 1px 3px rgba(0,0,0,0.06)",
              backdropFilter: "blur(10px)",
              cursor: "default",
              transition: "box-shadow 0.25s ease, border-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                `${card.accent}40`;
              (e.currentTarget as HTMLElement).style.boxShadow =
                `0 8px 30px ${card.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = s
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.07)";
              (e.currentTarget as HTMLElement).style.boxShadow = s
                ? "0 1px 0 rgba(255,255,255,0.03) inset"
                : "0 1px 3px rgba(0,0,0,0.06)";
            }}
          >
            {/* Left accent stripe */}
            <div
              className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
              style={{ background: card.accent, opacity: 0.7 }}
            />

            {/* Subtle glow orb */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: card.glow }}
            />

            <div className="flex items-start justify-between relative">
              <div>
                <p
                  className="text-xs font-medium mb-3 uppercase tracking-widest"
                  style={{
                    color: s ? "#475569" : "#94A3B8",
                    letterSpacing: "0.09em",
                  }}
                >
                  {card.label}
                </p>
                <p
                  className="mb-1"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "2rem",
                    lineHeight: 1,
                    color: s ? "#F8FAFC" : "#0F172A",
                  }}
                >
                  {card.value}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{
                    color: card.subColor,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {card.sub}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.iconBg }}
              >
                <Icon size={16} style={{ color: card.accent }} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
