"use client";

import {
  Clock3,
  Plus,
  Tags,
  Globe,
  Code2,
  Server,
  Terminal,
  FileCode,
  Copy,
  Check,
  Crown,
  Eye,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import Menu from "./menu";
import { Room } from "@/lib/store/types/roomTypes";
import { Badge } from "./badges";
import { toast } from "sonner";

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

function getProjectIcon(type?: string) {
  switch (type) {
    case "static":
      return <Globe className="h-4 w-4 text-blue-500" />;
    case "frontend":
      return <Code2 className="h-4 w-4 text-purple-500" />;
    case "backend":
      return <Server className="h-4 w-4 text-emerald-500" />;
    case "node-cli":
    case "terminal":
      return <Terminal className="h-4 w-4 text-amber-500" />;
    default:
      return <FileCode className="h-4 w-4 text-indigo-500" />;
  }
}

export default function Row({ rooms }: RowProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyRoomId = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Room ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#007acc]/10 text-[#007acc]">
          <Code2 className="h-5 w-5" />
        </div>

        <h3 className="text-sm font-semibold text-[#1e1e1e] dark:text-[#ffffff]">
          No workspaces found
        </h3>

        <p className="mt-1.5 max-w-xs text-xs text-[#616161] dark:text-[#969696] leading-relaxed">
          Create your first collaborative coding room and start building with your team in real time.
        </p>

        <Button
          asChild
          size="sm"
          className="mt-5 h-8.5 rounded-md bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] px-4 text-xs font-medium text-white shadow-none transition-colors"
        >
          <Link href="/playground">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create First Room
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#cecece] dark:divide-[#333333]">
      {rooms.map((room) => (
        <div
          key={room._id}
          className="
            group relative
            grid grid-cols-1
            gap-3
            px-5 py-3.5
            transition-colors
            hover:bg-[#f3f3f3] dark:hover:bg-[#2a2d2e]
            sm:grid-cols-[minmax(0,1fr)_150px_minmax(120px,180px)_40px]
            sm:items-center
            sm:gap-4
          "
        >
          {/* Room Icon & Name */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {/* Type Icon */}
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#f8f8f8] dark:bg-[#1e1e1e] transition-colors">
                {getProjectIcon(room.projectType)}
              </div>

              {/* Title & Metadata */}
              <div className="min-w-0">
                <Link
                  href={`/playground/${room._id}`}
                  className="block truncate text-sm font-medium text-[#1e1e1e] dark:text-[#ffffff] transition-colors hover:text-[#007acc] dark:hover:text-[#3794ff]"
                >
                  {room.name}
                </Link>

                <div className="mt-1 flex items-center gap-2">
                  {room.projectType && (
                    <span className="inline-flex rounded border border-[#007acc]/30 bg-[#007acc]/10 px-1.5 py-0.2 text-[10px] font-medium capitalize text-[#007acc] dark:text-[#3794ff]">
                      {room.projectType}
                    </span>
                  )}

                  {/* Role Badge */}
                  {room.isOwner || room.role === "owner" ? (
                    <span className="inline-flex items-center gap-0.5 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-medium text-amber-500">
                      <Crown className="w-2.5 h-2.5" />
                      Owner
                    </span>
                  ) : room.role === "viewer" ? (
                    <span className="inline-flex items-center gap-0.5 rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.2 text-[10px] font-medium text-purple-500">
                      <Eye className="w-2.5 h-2.5" />
                      Viewer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 rounded border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.2 text-[10px] font-medium text-sky-500">
                      <Pencil className="w-2.5 h-2.5" />
                      Editor
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => copyRoomId(room._id, e)}
                    title="Click to copy Room ID"
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-[#858585] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] transition-colors"
                  >
                    <span>{room._id.slice(0, 8)}...</span>
                    {copiedId === room._id ? (
                      <Check className="w-2.5 h-2.5 text-[#89d185]" />
                    ) : (
                      <Copy className="w-2.5 h-2.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity / Date */}
          <div className="flex items-center gap-2 text-xs text-[#616161] dark:text-[#969696]">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-[#858585]" />
            <span>{formatDate(room.lastActiveAt || room.updatedAt || room.createdAt!)}</span>
          </div>

          {/* Tags */}
          <div className="flex min-w-0 items-center gap-2">
            <Tags className="hidden h-3.5 w-3.5 shrink-0 text-[#858585] sm:block" />

            <div className="flex min-w-0 flex-wrap gap-1">
              {room.tags && room.tags.length > 0 ? (
                <>
                  {room.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={`${tag}-${index}`} tag={tag} />
                  ))}

                  {room.tags.length > 2 && (
                    <span className="rounded border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#333333] px-1.5 py-0.2 text-[9px] text-[#616161] dark:text-[#969696] font-medium">
                      +{room.tags.length - 2}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-[#858585]">No tags</span>
              )}
            </div>
          </div>

          {/* Kebab Action Menu */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:relative sm:right-auto sm:top-auto sm:translate-y-0">
            <Menu room={room} />
          </div>
        </div>
      ))}
    </div>
  );
}
