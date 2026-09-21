"use client";

import { useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  Bot,
  FileCode,
  FilePlus,
  FolderPlus,
  Pencil,
  Radio,
  Save,
  Search,
  Trash2,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { Activity } from "@/lib/store/types/explorerTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { avatarGradients } from "../../constant/dashboard";

function formatActivityTime(timestamp?: unknown): string {
  if (!timestamp) return "Just now";
  const numTime = typeof timestamp === "number" ? timestamp : typeof timestamp === "string" ? Number(timestamp) || Date.now() : Date.now();
  const diffSec = Math.floor((Date.now() - numTime) / 1000);
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(numTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getActivityIcon(type?: unknown) {
  const typeStr = typeof type === "string" ? type : "";
  switch (typeStr) {
    case "create:file":
      return <FilePlus className="size-3.5 text-emerald-400" />;
    case "create:folder":
      return <FolderPlus className="size-3.5 text-amber-400" />;
    case "rename:file":
    case "rename:folder":
      return <Pencil className="size-3.5 text-sky-400" />;
    case "delete:file":
    case "delete:folder":
      return <Trash2 className="size-3.5 text-red-400" />;
    case "file:saved":
      return <Save className="size-3.5 text-emerald-400" />;
    case "room:join":
      return <UserPlus className="size-3.5 text-blue-400" />;
    case "room:leave":
      return <UserMinus className="size-3.5 text-neutral-400" />;
    case "ai:chat":
      return <Bot className="size-3.5 text-purple-400" />;
    default:
      return <Radio className="size-3.5 text-sky-400" />;
  }
}

export function ActivityFeed() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const activityHistory = useExplorerstore((s) => s.activityHistory || s.activity || []);
  const clearActivityHistory = useExplorerstore((s) => s.clearActivityHistory);
  const members = useExplorerstore((s) => s.members);

  const filtered = useMemo(() => {
    if (!search.trim()) return activityHistory;
    const query = search.toLowerCase();
    return activityHistory.filter((item: Activity) => {
      const msg = typeof item.message === "string" ? item.message.toLowerCase() : "";
      const user = typeof item.userName === "string" ? item.userName.toLowerCase() : "";
      const file = typeof item.fileName === "string" ? item.fileName.toLowerCase() : "";
      const type = typeof item.type === "string" ? item.type.toLowerCase() : "";
      return msg.includes(query) || user.includes(query) || file.includes(query) || type.includes(query);
    });
  }, [activityHistory, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Workspace Activity History"
          className="flex items-center gap-1.5 rounded px-2 py-0.5 hover:bg-white/10 transition-colors text-xs text-white"
        >
          <ActivityIcon className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">Activity</span>
          {activityHistory.length > 0 && (
            <span className="rounded-full bg-white/20 px-1 py-0.2 text-[10px] font-mono leading-none">
              {activityHistory.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        className="w-[380px] p-0 bg-[#1e1e1e]/98 border-[#3c3c3c] text-xs text-[#cccccc] shadow-2xl backdrop-blur-md rounded-lg"
      >
        {/* Header */}
        <div className="flex h-10 items-center justify-between border-b border-[#2d2d30] px-3.5 bg-[#252526]/80">
          <div className="flex items-center gap-2">
            <Radio className="size-3.5 text-emerald-400" />
            <span className="font-semibold text-white">Live Activity Feed</span>
            <span className="rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] text-neutral-300">
              {members.length} online
            </span>
          </div>

          <div className="flex items-center gap-1">
            {activityHistory.length > 0 && (
              <button
                type="button"
                onClick={() => clearActivityHistory?.()}
                className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Clear history"
              >
                <Trash2 className="size-3" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        {activityHistory.length > 0 && (
          <div className="relative border-b border-[#2d2d30] px-3 py-1.5 bg-[#18181a]">
            <Search className="absolute left-4 top-2.5 size-3.5 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter activities by user, file, or action..."
              className="w-full rounded bg-white/5 pl-6 pr-2 py-1 text-[11px] text-white placeholder-neutral-500 outline-none focus:ring-1 focus:ring-sky-500/50"
            />
          </div>
        )}

        {/* List of Activities */}
        <div className="max-h-[360px] overflow-y-auto p-2 space-y-1.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-neutral-500">
              <FileCode className="size-8 stroke-1 text-neutral-600" />
              <p className="text-xs font-medium text-neutral-400">
                {search ? "No matching activity" : "No recent activity"}
              </p>
              <p className="text-[11px] text-neutral-500 max-w-56">
                Collaborative actions like file edits, saves, and joins will be logged here.
              </p>
            </div>
          ) : (
            filtered.map((item: Activity, idx: number) => {
              const gradient = avatarGradients[idx % avatarGradients.length];
              const userName = typeof item.userName === "string" ? item.userName : "Collaborator";
              const initials = userName
                .split(" ")
                .map((w: string) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const message = typeof item.message === "string" ? item.message : "";
              const type = typeof item.type === "string" ? item.type : "action";
              const fileName = typeof item.fileName === "string" ? item.fileName : "";

              return (
                <div
                  key={item.id || idx}
                  className="flex items-start gap-2.5 rounded-md border border-white/[0.04] bg-[#252526]/60 p-2 hover:bg-[#2a2d2e] transition-colors"
                >
                  {/* User Initial Avatar */}
                  <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm"
                    style={{ background: gradient }}
                    title={userName}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        {getActivityIcon(item.type)}
                        <span className="font-medium text-neutral-200 truncate">
                          {userName}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {formatActivityTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-neutral-300 line-clamp-2">
                      {message || `${userName} performed ${type}`}
                    </p>

                    {fileName && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.2 font-mono text-[10px] text-sky-300">
                        {fileName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ActivityFeed;
