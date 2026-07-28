import { Code2 } from "lucide-react";
import { AvatarStack } from "./avatarStack";
import { LangBadge } from "./lagnBadge";
import { RowMenu } from "./rowMenu";
import { Room } from "../dashboard";
import { motion } from "motion/react";
// --- Mobile Room Card ---
export function MobileCard({
  room,
  index,
  onDelete,
  isDark,
}: {
  room: Room;
  index: number;
  onDelete: () => void;
  isDark: boolean;
}) {
  const s = isDark;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="rounded-xl p-4"
      style={{
        background: s ? "rgba(30,41,59,0.4)" : "rgba(255,255,255,0.8)",
        border: `1px solid ${s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(99,102,241,0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgba(99,102,241,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = s
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.12)" }}
          >
            <Code2 size={14} style={{ color: "#818CF8" }} />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: s ? "#F1F5F9" : "#0F172A" }}
            >
              {room.name}
            </p>
            <div className="mt-0.5">
              <LangBadge language={room.language} />
            </div>
          </div>
        </div>
        <RowMenu onDelete={onDelete} isDark={isDark} />
      </div>
      <div className="flex items-center justify-between mt-3">
        {/* <AvatarStack members={room.members} isDark={isDark} /> */}
        <span
          className="text-xs"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: s ? "#475569" : "#94A3B8",
          }}
        >
          {room.lastOpened}
        </span>
      </div>
    </motion.div>
  );
}
