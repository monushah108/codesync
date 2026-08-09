"use client";

import { useEffect } from "react";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

import { useRoomStore } from "@/lib/store/Roomstore";
import { RoomActions } from "@/lib/store/actions/useRoomAction";

import Row from "./row";
import { Button } from "../ui/button";

export default function RecentRooms() {
  const rooms = useRoomStore((s) => s.rooms);
  const loading = useRoomStore((s) => s.loading);

  useEffect(() => {
    RoomActions.loadRooms();
  }, []);

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between">
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

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-600 sm:block">
            {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
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
        ) : (
          <Row rooms={rooms} />
        )}
      </div>
    </section>
  );
}
