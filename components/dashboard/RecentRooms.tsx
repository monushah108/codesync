import { useMemo, useState } from "react";
import { motion } from "motion/react";

import type { Room } from "./dashboard";

import { Header } from "./Header";
import Table from "./ui/Table";

import { SORT_OPTS } from "../constant/dashboard";

interface Props {
  rooms: Room[];
  onDeleteRoom: (id: string) => void;
  onCreateRoom: () => void;
  isDark: boolean;
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
    let result = rooms.filter((room) =>
      room.name.toLowerCase().includes(search.toLowerCase()),
    );

    switch (sort) {
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "members":
        result = [...result].sort(
          (a, b) => b.members.length - a.members.length,
        );
        break;

      default:
        break;
    }

    return result;
  }, [rooms, search, sort]);

  const currentSortLabel =
    SORT_OPTS.find((item) => item.value === sort)?.label ?? "Sort";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.32 }}
      className="mb-20"
    >
      <Header
        s={s}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        currentSortLabel={currentSortLabel}
      />

      <Table
        filtered={filtered}
        isDark={isDark}
        s={s}
        onCreateRoom={onCreateRoom}
        onDeleteRoom={onDeleteRoom}
      />

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
