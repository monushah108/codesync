import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  UserPlus,
  Pencil,
  Copy,
  Share2,
  Trash2,
  Code2,
  FolderOpen,
  Laptop,
  Terminal,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { Room } from "./dashboard";
// import type { Room } from "../App";

interface Props {
  rooms: Room[];
  onDeleteRoom: (id: string) => void;
  onCreateRoom: () => void;
  isDark: boolean;
}

// Language badge colours
const LANG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  JavaScript: { bg: "rgba(247,223,30,0.12)", text: "#FACC15", dot: "#EAB308" },
  TypeScript: { bg: "rgba(59,130,246,0.14)", text: "#60A5FA", dot: "#3B82F6" },
  Python: { bg: "rgba(96,165,250,0.13)", text: "#7DD3FC", dot: "#38BDF8" },
  "C++": { bg: "rgba(244,63,94,0.13)", text: "#FB7185", dot: "#F43F5E" },
  Rust: { bg: "rgba(251,146,60,0.13)", text: "#FB923C", dot: "#F97316" },
  Go: { bg: "rgba(34,211,238,0.12)", text: "#67E8F9", dot: "#22D3EE" },
  Java: { bg: "rgba(239,68,68,0.12)", text: "#FCA5A5", dot: "#EF4444" },
};

function LangBadge({ language }: { language: string }) {
  const c = LANG_COLORS[language] ?? {
    bg: "rgba(99,102,241,0.12)",
    text: "#818CF8",
    dot: "#6366F1",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.dot}28`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.dot }}
      />
      {language}
    </span>
  );
}

function AvatarStack({
  members,
  isDark,
}: {
  members: Room["members"];
  isDark: boolean;
}) {
  const show = members.slice(0, 3);
  const extra = members.length - 3;
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="flex items-center cursor-default">
            {show.map((m, i) => (
              <div
                key={m.name + i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                style={{
                  background: m.color,
                  marginLeft: i > 0 ? "-7px" : 0,
                  zIndex: show.length - i,
                  boxShadow: `0 0 0 2px ${isDark ? "#09090B" : "#F8FAFC"}`,
                }}
              >
                {m.initials}
              </div>
            ))}
            {extra > 0 && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                style={{
                  background: isDark ? "#1E293B" : "#E2E8F0",
                  color: isDark ? "#94A3B8" : "#64748B",
                  marginLeft: "-7px",
                  zIndex: 0,
                  boxShadow: `0 0 0 2px ${isDark ? "#09090B" : "#F8FAFC"}`,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                +{extra}
              </div>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-xl px-3 py-2.5 text-xs"
            sideOffset={8}
            style={{
              background: isDark ? "rgba(15,23,42,0.96)" : "#fff",
              border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.09)"}`,
              boxShadow: isDark
                ? "0 12px 32px rgba(0,0,0,0.5)"
                : "0 12px 32px rgba(0,0,0,0.1)",
              backdropFilter: "blur(12px)",
              color: isDark ? "#F8FAFC" : "#0F172A",
            }}
          >
            <div className="space-y-1.5">
              {members.map((m) => (
                <div key={m.name} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
            <Tooltip.Arrow
              style={{ fill: isDark ? "rgba(15,23,42,0.96)" : "#fff" }}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

const ROW_ACTIONS = [
  { icon: <ExternalLink size={12} />, label: "Open Room" },
  { icon: <UserPlus size={12} />, label: "Invite Members" },
  { icon: <Pencil size={12} />, label: "Rename" },
  { icon: <Copy size={12} />, label: "Duplicate" },
  { icon: <Share2 size={12} />, label: "Share Link" },
];

function RowMenu({
  onDelete,
  isDark,
}: {
  onDelete: () => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const s = isDark;
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-7 h-7 rounded-lg outline-none transition-colors"
          style={{
            background: open
              ? s
                ? "rgba(99,102,241,0.15)"
                : "rgba(99,102,241,0.1)"
              : "transparent",
            color: s ? "#475569" : "#94A3B8",
          }}
          onMouseEnter={(e) => {
            if (!open)
              (e.currentTarget as HTMLElement).style.background = s
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            if (!open)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <MoreHorizontal size={15} />
        </motion.button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content asChild sideOffset={6} align="end">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -4 }}
                transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="z-50 w-44 rounded-xl overflow-hidden py-1"
                style={{
                  background: s
                    ? "rgba(15,23,42,0.96)"
                    : "rgba(255,255,255,0.98)",
                  border: `1px solid ${s ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.09)"}`,
                  boxShadow: s
                    ? "0 16px 40px rgba(0,0,0,0.5)"
                    : "0 16px 40px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {ROW_ACTIONS.map((a) => (
                  <DropdownMenu.Item
                    key={a.label}
                    className="outline-none cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors"
                      style={{ color: s ? "#E2E8F0" : "#1E293B" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = s
                          ? "rgba(99,102,241,0.1)"
                          : "rgba(99,102,241,0.06)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <span style={{ color: "#6366F1" }}>{a.icon}</span>
                      {a.label}
                    </div>
                  </DropdownMenu.Item>
                ))}
                <div
                  className="mx-2 my-1 h-px"
                  style={{
                    background: s
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  }}
                />
                <DropdownMenu.Item
                  onSelect={onDelete}
                  className="outline-none cursor-pointer"
                >
                  <div
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors"
                    style={{ color: "#EF4444" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(239,68,68,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Trash2 size={12} /> Delete
                  </div>
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

const SORT_OPTS = [
  { value: "recent", label: "Recently Opened" },
  { value: "name", label: "Name (A–Z)" },
  { value: "members", label: "Most Members" },
];

// --- Empty State ---
function EmptyState({
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

// --- Mobile Room Card ---
function MobileCard({
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
        <AvatarStack members={room.members} isDark={isDark} />
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

export function RecentRooms({
  rooms,
  onDeleteRoom,
  onCreateRoom,
  isDark,
}: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const s = isDark;

  const filtered = useMemo(() => {
    let r = rooms.filter((x) =>
      x.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (sort === "name")
      r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "members")
      r = [...r].sort((a, b) => b.members.length - a.members.length);
    return r;
  }, [rooms, search, sort]);

  const currentSortLabel =
    SORT_OPTS.find((o) => o.value === sort)?.label ?? "Sort";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.32 }}
      className="mb-20"
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h2
            className="text-xl"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              color: s ? "#F8FAFC" : "#0F172A",
            }}
          >
            Recent Rooms
          </h2>
          <p
            className="text-sm mt-0.5"
            style={{ color: s ? "#475569" : "#94A3B8" }}
          >
            Continue where you left off.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: s ? "#475569" : "#94A3B8" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="pl-8 pr-3 py-2 text-sm rounded-xl outline-none w-44 sm:w-52 transition-all"
              style={{
                background: s ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                color: s ? "#F1F5F9" : "#0F172A",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.border =
                  "1px solid rgba(99,102,241,0.45)";
                (e.currentTarget as HTMLInputElement).style.boxShadow =
                  "0 0 0 3px rgba(99,102,241,0.08)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.border =
                  `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`;
                (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* Filter */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors"
            style={{
              background: s ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
              color: s ? "#64748B" : "#94A3B8",
            }}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filter</span>
          </motion.button>

          {/* Sort */}
          <DropdownMenu.Root open={sortOpen} onOpenChange={setSortOpen}>
            <DropdownMenu.Trigger asChild>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors"
                style={{
                  background: s ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                  color: s ? "#64748B" : "#94A3B8",
                }}
              >
                <span className="hidden sm:inline">{currentSortLabel}</span>
                <ChevronDown
                  size={13}
                  style={{
                    transform: sortOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                  }}
                />
              </motion.button>
            </DropdownMenu.Trigger>
            <AnimatePresence>
              {sortOpen && (
                <DropdownMenu.Portal forceMount>
                  <DropdownMenu.Content asChild sideOffset={6} align="end">
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className="z-50 w-44 rounded-xl overflow-hidden py-1"
                      style={{
                        background: s
                          ? "rgba(15,23,42,0.96)"
                          : "rgba(255,255,255,0.98)",
                        border: `1px solid ${s ? "rgba(99,102,241,0.18)" : "rgba(0,0,0,0.09)"}`,
                        boxShadow: s
                          ? "0 12px 32px rgba(0,0,0,0.5)"
                          : "0 12px 32px rgba(0,0,0,0.1)",
                        backdropFilter: "blur(16px)",
                      }}
                    >
                      {SORT_OPTS.map((opt) => (
                        <DropdownMenu.Item
                          key={opt.value}
                          onSelect={() => setSort(opt.value)}
                          className="outline-none cursor-pointer"
                        >
                          <div
                            className="flex items-center justify-between px-3 py-2 text-[13px] transition-colors"
                            style={{ color: s ? "#E2E8F0" : "#1E293B" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = s
                                ? "rgba(99,102,241,0.1)"
                                : "rgba(99,102,241,0.06)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            {opt.label}
                            {sort === opt.value && <Check16 />}
                          </div>
                        </DropdownMenu.Item>
                      ))}
                    </motion.div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              )}
            </AnimatePresence>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Table container */}
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

                        <td className="px-5 py-4">
                          <AvatarStack members={room.members} isDark={isDark} />
                        </td>

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

      {filtered.length > 0 && (
        <p
          className="text-center text-xs mt-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: s ? "#334155" : "#CBD5E1",
          }}
        >
          {filtered.length} / {rooms.length} rooms
        </p>
      )}
    </motion.section>
  );
}

function Check16() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1.5 5.5L4 8.5L9.5 2.5"
        stroke="#6366F1"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
