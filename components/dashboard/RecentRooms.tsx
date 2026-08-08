import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import type { Room } from "./dashboard";

import Header from "./ui/header";
import Table from "./ui/Table";

import { SORT_OPTS } from "../constant/dashboard";
import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { useRoomStore } from "@/lib/store/Roomstore";
import { MemberActions } from "@/lib/store/actions/useMemberAction";

interface Props {
  rooms: Room[];
  onDeleteRoom: (id: string) => void;
  onCreateRoom: () => void;
  isDark: boolean;
}

export function RecentRooms({ onDeleteRoom, onCreateRoom, isDark }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);

  const s = isDark;

  useEffect(() => {
    // RoomActions.loadRooms();
    // MemberActions.LoadMembers();
  }, []);

  const { rooms, loading, error } = useRoomStore();

  const filtered = useMemo(() => {
    const result = rooms.filter((room) =>
      room.name.toLowerCase().includes(search.toLowerCase()),
    );

    switch (sort) {
      case "name":
        return result.toSorted((a, b) => a.name.localeCompare(b.name));

      case "members":
        return result.toSorted((a, b) => b.members.length - a.members.length);

      default:
        return result;
    }
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
        loading={loading}
        error={error}
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
