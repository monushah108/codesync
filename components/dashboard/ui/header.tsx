import { SORT_OPTS } from "@/components/constant/dashboard";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Header({
  s,
  search,
  setSearch,
  sort,
  setSort,
  sortOpen,
  setSortOpen,
  currentSortLabel,
}) {
  return (
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
