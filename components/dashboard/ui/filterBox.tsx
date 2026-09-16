import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Room } from "@/lib/store/types/roomTypes";
import {
  FileCode2,
  Filter,
  LayoutGrid,
  Monitor,
  Search,
  Server,
  Terminal,
  X,
} from "lucide-react";

type p = "static" | "backend" | "frontend" | "terminal" | "all";

interface filterprops {
  rooms: Room[];
  setSearch: (s: string) => void;
  search: string;
  projectType: p;
  setProjectType: (s: p) => void;
  hasActiveFilter: boolean;
  clearFilters: () => void;
}

export default function FilterBox({
  rooms,
  setSearch,
  search,
  projectType,
  setProjectType,
  hasActiveFilter,
  clearFilters,
}: filterprops) {
  if (!rooms.length) return;
  return (
    <div className="mb-3 flex items-center gap-2">
      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms..."
          className="h-8 rounded-md border-slate-800 bg-slate-950/60 pl-8 pr-8 text-[11px] text-slate-300 placeholder:text-slate-600 focus-visible:border-indigo-500/40 focus-visible:ring-1 focus-visible:ring-indigo-500/10"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="relative">
        {/* Filter Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`h-8 rounded-md border-slate-800 bg-slate-950/60 px-2.5 text-[11px] ${
                projectType !== "all"
                  ? "border-indigo-500/30 text-indigo-300"
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
              }`}
            >
              <Filter className="mr-1.5 h-3 w-3" />
              Filter
              {projectType !== "all" && (
                <span className="ml-1 rounded bg-indigo-500/10 px-1 text-[9px] text-indigo-400">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-40 border-slate-800 bg-slate-950 p-1 text-slate-300"
          >
            <DropdownMenuLabel className="px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Project type
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-slate-800" />

            <DropdownMenuRadioGroup
              value={projectType}
              onValueChange={(value) => setProjectType(value as p)}
            >
              {[
                { value: "all", label: "All rooms", icon: LayoutGrid },
                { value: "static", label: "Static", icon: FileCode2 },
                { value: "frontend", label: "Frontend", icon: Monitor },
                { value: "backend", label: "Backend", icon: Server },
                { value: "terminal", label: "Terminal", icon: Terminal },
              ].map((option) => {
                const Icon = option.icon;

                return (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="group rounded-md px-2 py-2 text-[11px] text-slate-500 outline-none focus:bg-slate-900 focus:text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-slate-600 transition-colors group-focus:text-indigo-400" />

                      <span>{option.label}</span>
                    </div>
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clear */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/60 px-2.5 text-[11px] font-medium text-slate-500 transition-colors hover:border-slate-700 hover:bg-slate-900 hover:text-slate-300"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
