"use client";

import {
  Binary,
  MessageSquare,
  PanelBottomOpen,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

import { Button } from "../ui/button";
import { useLayout } from "@/context/layout-context";
import Link from "next/link";

export default function PlayHeader() {
  const { panels, toggle } = useLayout();

  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#323233] px-2.5 text-[#d4d4d4]">
      {/* Logo */}
      <div className="flex items-center gap-4 md:gap-8">
        <Link
          href="/dashboard"
          className="group hidden items-center gap-1 rounded-sm px-2 py-1.5 transition-colors hover:bg-[#3a3a3d] md:flex"
        >
          <Binary className="size-5 text-[#007acc] transition-colors group-hover:text-[#3794ff]" />

          <span className="hidden font-semibold text-[#3794ff] group-hover:inline">
            codesync
          </span>
        </Link>
      </div>

      {/* Panel Controls */}
      <div className="flex items-center gap-0.5">
        {/* Chat */}
        <Button
          type="button"
          onClick={() => toggle("chat")}
          variant="ghost"
          size="xs"
          title={panels.chat ? "Hide Chat" : "Show Chat"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${panels.chat ? "bg-[#3a3a3d] text-[#3794ff]" : ""}
          `}
        >
          <Sparkles className="size-4" />
        </Button>
        {/* Explorer */}
        <Button
          type="button"
          onClick={() => toggle("explorer")}
          variant="ghost"
          size="xs"
          title={panels.explorer ? "Hide Explorer" : "Show Explorer"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${panels.explorer ? "bg-[#3a3a3d]" : ""}
          `}
        >
          <PanelLeftOpen className="size-4" />
        </Button>

        {/* Terminal */}
        <Button
          type="button"
          onClick={() => toggle("terminal")}
          variant="ghost"
          size="xs"
          title={panels.terminal ? "Hide Terminal" : "Show Terminal"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${panels.terminal ? "bg-[#3a3a3d]" : ""}
          `}
        >
          <PanelBottomOpen className="size-4" />
        </Button>
      </div>
    </div>
  );
}
