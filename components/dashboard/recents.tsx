"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

import { useRoomStore } from "@/lib/store/types/../Roomstore";
import { RoomActions } from "@/lib/store/actions/useRoomAction";

import Row from "./row";
import { Button } from "../ui/button";
import { Room } from "@/lib/store/types/roomTypes";
import FilterBox from "./ui/filterBox";

export default function RecentRooms() {
  const rooms = useRoomStore((s) => s.rooms);
  const loading = useRoomStore((s) => s.loading);
  const error = useRoomStore((s) => s.error);

  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState<
    "static" | "backend" | "frontend" | "terminal" | "all"
  >("all");

  useEffect(() => {
    RoomActions.loadRooms();
  }, []);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rooms.filter((room: Room) => {
      const matchesSearch = !query || room.name?.toLowerCase().includes(query);
      const matchesType =
        projectType === "all" || room.projectType === projectType;

      return matchesSearch && matchesType;
    });
  }, [rooms, search, projectType]);

  const hasActiveFilter = search.trim() !== "" || projectType !== "all";

  const clearFilters = () => {
    setSearch("");
    setProjectType("all");
  };

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#007acc]/10 text-[#007acc]">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1e1e1e] dark:text-[#ffffff]">
              Recent Workspaces
            </h2>

            <p className="text-xs text-[#616161] dark:text-[#969696]">
              Manage and collaborate in your active coding rooms.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-xs font-medium text-[#616161] dark:text-[#969696]">
            {filteredRooms.length}{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"}
          </span>

          <Button
            asChild
            size="sm"
            className="h-8.5 rounded-md bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] px-3.5 text-xs font-medium text-white shadow-none transition-colors"
          >
            <Link href="/playground">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Room
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <FilterBox
        rooms={rooms}
        setSearch={setSearch}
        search={search}
        projectType={projectType}
        setProjectType={setProjectType}
        hasActiveFilter={hasActiveFilter}
        clearFilters={clearFilters}
      />

      {/* Table Container - VS Code Explorer / Panel List Style */}
      <div className="overflow-hidden rounded-xl border border-[#cecece] dark:border-[#333333] bg-[#ffffff] dark:bg-[#252526] shadow-xs transition-colors">
        {/* Table Header */}
        <div className="hidden grid-cols-[minmax(0,1fr)_150px_minmax(120px,180px)_40px] items-center gap-4 border-b border-[#cecece] dark:border-[#333333] bg-[#f8f8f8] dark:bg-[#1f1f1f] px-5 py-2.5 sm:grid">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#616161] dark:text-[#858585]">
            Workspace
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#616161] dark:text-[#858585]">
            Created
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#616161] dark:text-[#858585]">
            Tags
          </span>

          <span />
        </div>

        {/* Loading State */}
        {loading && rooms.length === 0 ? (
          <div className="divide-y divide-[#cecece] dark:divide-[#333333]">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 px-5 py-3.5"
              >
                <div className="h-8 w-8 rounded-md bg-[#e5e5e5] dark:bg-[#333333]" />

                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-36 rounded bg-[#e5e5e5] dark:bg-[#333333]" />
                  <div className="h-2.5 w-24 rounded bg-[#f0f0f0] dark:bg-[#2a2a2a]" />
                </div>

                <div className="hidden h-3 w-20 rounded bg-[#f0f0f0] dark:bg-[#2a2a2a] sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>

            <p className="text-sm font-semibold text-[#1e1e1e] dark:text-[#ffffff]">
              Couldn't load your workspaces
            </p>

            <p className="mt-1 max-w-sm text-xs text-[#616161] dark:text-[#969696] leading-relaxed">
              Something went wrong while fetching your recent rooms from the server.
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={() => RoomActions.loadRooms()}
              className="mt-4 h-8.5 rounded-md border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#2d2d2d] text-xs font-medium gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </Button>
          </div>
        ) : hasActiveFilter && filteredRooms.length === 0 ? (
          /* Search Empty State */
          <div className="flex min-h-52 flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#f0f0f0] dark:bg-[#333333] text-[#858585]">
              <Search className="h-4 w-4" />
            </div>

            <p className="text-sm font-semibold text-[#1e1e1e] dark:text-[#ffffff]">
              No matching rooms found
            </p>

            <p className="mt-1 text-xs text-[#616161] dark:text-[#969696]">
              Try adjusting your search query or reset the project filter.
            </p>

            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="mt-3 h-8 text-xs font-medium text-[#007acc] hover:bg-[#007acc]/10"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          /* Room Rows */
          <Row rooms={filteredRooms} />
        )}
      </div>
    </section>
  );
}
