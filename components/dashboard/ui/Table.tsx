import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { EmptyState } from "./emptyState";
import { Code2 } from "lucide-react";
import { LangBadge } from "./lagnBadge";
import { AvatarStack } from "./avatarStack";
import { RowMenu } from "./rowMenu";
import { MobileCard } from "./mobileCard";
export default function Table({
  filtered,
  isDark,
  s,
  onCreateRoom,
  onDeleteRoom,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: s ? "rgba(13,17,23,0.6)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
        backdropFilter: "blur(16px)",
        boxShadow: s
          ? "0 1px 0 rgba(255,255,255,0.02) inset"
          : "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {filtered.length === 0 ? (
        <EmptyState onCreateRoom={onCreateRoom} isDark={isDark} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: `1px solid ${s ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  {["#", "Room Name", "Members", "Last Opened", ""].map(
                    (col, ci) => (
                      <th
                        key={ci}
                        className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-widest"
                        style={{
                          color: s ? "#334155" : "#94A3B8",
                          letterSpacing: "0.08em",
                          background: s
                            ? "rgba(255,255,255,0.01)"
                            : "rgba(0,0,0,0.02)",
                          width: ci === 4 ? "80px" : undefined,
                        }}
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((room, i) => (
                    <motion.tr
                      key={room.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22, delay: i * 0.04 }}
                      className="group relative cursor-pointer"
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? `1px solid ${s ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}`
                            : "none",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = s
                          ? "rgba(99,102,241,0.04)"
                          : "rgba(99,102,241,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                      }}
                    >
                      {/* Left glow border on hover */}
                      <td className="relative pl-5 pr-3 py-4 w-10">
                        <div
                          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ background: "#6366F1" }}
                        />
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "11px",
                            color: s ? "#334155" : "#CBD5E1",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(99,102,241,0.1)" }}
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
                            <div className="mt-1">
                              <LangBadge language={room.language} />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* <td className="px-5 py-4">
                        <AvatarStack members={room.members} isDark={isDark} />
                      </td> */}

                      <td className="px-5 py-4">
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "12px",
                            color: s ? "#475569" : "#94A3B8",
                          }}
                        >
                          {room.lastOpened}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all opacity-0 group-hover:opacity-100"
                            style={{
                              background: "rgba(99,102,241,0.12)",
                              color: "#818CF8",
                              border: "1px solid rgba(99,102,241,0.22)",
                            }}
                            onMouseEnter={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(99,102,241,0.22)")
                            }
                            onMouseLeave={(e) =>
                              ((
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(99,102,241,0.12)")
                            }
                          >
                            Open
                          </motion.button>
                          <RowMenu
                            onDelete={() => onDeleteRoom(room.id)}
                            isDark={isDark}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-4 space-y-3">
            <AnimatePresence>
              {filtered.map((room, i) => (
                <MobileCard
                  key={room.id}
                  room={room}
                  index={i}
                  onDelete={() => onDeleteRoom(room.id)}
                  isDark={isDark}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
