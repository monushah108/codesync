import { Binary, Clock3, Plus, Tags } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import Menu from "./menu";
import { Room } from "@/lib/store/types/roomTypes";
import { Badge } from "./badges";

type RowProps = {
  rooms: Room[];
};

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function Row({ rooms }: RowProps) {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80">
          <Binary className="h-5 w-5 text-slate-600" />
        </div>

        <h3 className="text-sm font-medium text-slate-300">No rooms yet</h3>

        <p className="mt-1 max-w-xs text-xs leading-5 text-slate-600">
          Create your first collaboration room and start coding together.
        </p>

        <Button
          asChild
          size="sm"
          className="mt-5 h-8 rounded-lg bg-indigo-600 px-3 text-xs text-white hover:bg-indigo-500"
        >
          <Link href="/playground">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create room
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/50">
      {rooms.map((room) => (
        <div
          key={room._id}
          className="
            group relative
            grid grid-cols-1
            gap-3
            px-5 py-4
            transition-colors
            hover:bg-white/[0.025]
            sm:grid-cols-[minmax(0,1fr)_150px_minmax(120px,180px)_40px]
            sm:items-center
            sm:gap-4
          "
        >
          {/* Room */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 transition-colors group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5">
                <Binary className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
              </div>

              {/* Name */}
              <div className="min-w-0">
                <Link
                  href={`/playground/${room._id}`}
                  className="block truncate text-sm font-medium text-slate-200 transition-colors hover:text-indigo-300"
                >
                  {room.name}
                </Link>

                <span className="mt-0.5 block truncate font-mono text-[10px] text-slate-700">
                  {room._id}
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-slate-700" />

            <span>{formatDate(room.createdAt)}</span>
          </div>

          {/* Tags */}
          <div className="flex min-w-0 items-center gap-2">
            <Tags className="hidden h-3.5 w-3.5 shrink-0 text-slate-700 sm:block" />

            <div className="flex min-w-0 flex-wrap gap-1.5">
              {room.tags && room.tags.length > 0 ? (
                <>
                  {room.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={`${tag}-${index}`} tag={tag} />
                  ))}

                  {room.tags.length > 3 && (
                    <span className="rounded-md border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-600">
                      +{room.tags.length - 3}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-slate-700">No tags</span>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0">
            <Menu room={room} />
          </div>
        </div>
      ))}
    </div>
  );
}
