"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { useRoomStore } from "@/lib/store/Roomstore";
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
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/15 bg-indigo-500/10">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-200">
              Recent rooms
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Your recently created collaboration rooms.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-xs text-slate-600">
            {filteredRooms.length}{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"}
          </span>

          <Button
            asChild
            size="sm"
            className="h-8 rounded-lg bg-indigo-600 px-3 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500"
          >
            <Link href="/playground">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New room
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <FilterBox
        rooms={rooms}
        setSearch={setSearch}
        search={search}
        projectType={projectType}
        setProjectType={setProjectType}
        hasActiveFilter={hasActiveFilter}
        clearFilters={clearFilters}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 shadow-2xl shadow-black/20">
        {/* Table Header */}
        <div className="hidden grid-cols-[minmax(0,1fr)_150px_minmax(120px,180px)_40px] items-center gap-4 border-b border-slate-800/70 bg-slate-900/30 px-5 py-3 sm:grid">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Room
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Created
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Tags
          </span>

          <span />
        </div>

        {/* Loading */}
        {loading && rooms.length === 0 ? (
          <div className="divide-y divide-slate-800/50">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 px-5 py-4"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-800/70" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-slate-800/70" />
                  <div className="h-2 w-20 rounded bg-slate-800/50" />
                </div>

                <div className="hidden h-3 w-20 rounded bg-slate-800/60 sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="absolute h-14 w-14 rounded-full border border-indigo-500/20 bg-indigo-500/5" />

              <svg
                viewBox="0 0 64 64"
                className="relative h-12 w-12 text-slate-600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 44h25a9 9 0 0 0 1-18 13 13 0 0 0-25-2 10 10 0 0 0-1 20Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M25 35l5 5m0-5l-5 5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <path
                  d="M38 35h6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Couldn't load your rooms
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Something went wrong while fetching your recent rooms. Please try
              again.
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={() => RoomActions.loadRooms()}
              className="mt-4 h-8 rounded-lg border-slate-800 bg-slate-900/50 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Try again
            </Button>
          </div>
        ) : hasActiveFilter && filteredRooms.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60">
              <Search className="h-4 w-4 text-slate-600" />
            </div>

            <p className="text-sm font-medium text-slate-300">No rooms found</p>

            <p className="mt-1 text-xs text-slate-600">
              Try a different search or filter.
            </p>

            {hasActiveFilter && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="mt-2 h-7 text-xs text-indigo-400 hover:bg-indigo-500/5 hover:text-indigo-300"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <Row rooms={filteredRooms} />
        )}
      </div>
    </section>
  );
}
