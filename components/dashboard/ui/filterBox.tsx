"use client";

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
  if (!rooms.length) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#858585]" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms by name..."
          className="h-8.5 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#313131] pl-8 pr-8 text-xs text-[#1e1e1e] dark:text-[#cccccc] placeholder:text-[#858585] shadow-none focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-colors"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`h-8.5 rounded-md border px-3 text-xs shadow-none transition-colors gap-1.5 ${
                projectType !== "all"
                  ? "border-[#007acc]/40 text-[#007acc] bg-[#007acc]/10 font-medium"
                  : "border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] text-[#616161] dark:text-[#cccccc] hover:bg-[#e5e5e5] dark:hover:bg-[#2d2d2d]"
              }`}
            >
              <Filter className="h-3.5 w-3.5 text-[#007acc]" />
              <span>Filter</span>
              {projectType !== "all" && (
                <span className="ml-1 rounded bg-[#007acc]/20 px-1.5 py-0.2 text-[10px] text-[#007acc] font-mono">
                  1
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-44 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] p-1 text-[#1e1e1e] dark:text-[#cccccc] shadow-lg"
          >
            <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#858585]">
              Project Environment
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-[#e5e5e5] dark:bg-[#333333]" />

            <DropdownMenuRadioGroup
              value={projectType}
              onValueChange={(value) => setProjectType(value as p)}
            >
              {[
                { value: "all", label: "All rooms", icon: LayoutGrid },
                { value: "static", label: "Static Web", icon: FileCode2 },
                { value: "frontend", label: "Frontend", icon: Monitor },
                { value: "backend", label: "Backend", icon: Server },
                { value: "terminal", label: "Terminal", icon: Terminal },
              ].map((option) => {
                const Icon = option.icon;

                return (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="group rounded px-2 py-1.5 text-xs text-[#616161] dark:text-[#cccccc] outline-none focus:bg-[#e5e5e5] dark:focus:bg-[#04395e] focus:text-[#1e1e1e] dark:focus:text-[#ffffff] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-[#858585] group-focus:text-[#007acc]" />
                      <span>{option.label}</span>
                    </div>
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clear Filters */}
      {hasActiveFilter && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex h-8.5 items-center gap-1.5 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#2d2d2d] px-3 text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] transition-colors"
        >
          <X className="h-3 w-3" />
          <span>Reset filter</span>
        </button>
      )}
    </div>
  );
}
