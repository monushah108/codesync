"use client";

import { Binary, PanelBottomOpen, PanelLeftOpen, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "../ui/button";
import { useLayoutstore } from "@/lib/store/Layoutstore";

export default function PlayHeader() {
  const panel = useLayoutstore((s) => s.panels);

  const togglePanel = useLayoutstore((s) => s.togglePanel);

  const isChatOpen = panel.chat;
  const isTerminalOpen = panel.terminal;
  const isExplorerOpen = panel.explorer;

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
          onClick={() => togglePanel("chat")}
          variant="ghost"
          size="xs"
          title={isChatOpen ? "Hide Chat" : "Show Chat"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${isChatOpen ? "bg-[#3a3a3d] text-[#3794ff]" : ""}
          `}
        >
          <Sparkles className="size-4" />
        </Button>

        {/* Explorer */}
        <Button
          type="button"
          onClick={() => togglePanel("explorer")}
          variant="ghost"
          size="xs"
          title={isExplorerOpen ? "Hide Explorer" : "Show Explorer"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${isExplorerOpen ? "bg-[#3a3a3d] text-[#3794ff]" : ""}
          `}
        >
          <PanelLeftOpen className="size-4" />
        </Button>

        {/* Terminal */}
        <Button
          type="button"
          onClick={() => togglePanel("terminal")}
          variant="ghost"
          size="xs"
          title={isTerminalOpen ? "Hide Terminal" : "Show Terminal"}
          className={`
            text-[#d4d4d4]
            hover:bg-[#3a3a3d]
            hover:text-white
            ${isTerminalOpen ? "bg-[#3a3a3d] text-[#3794ff]" : ""}
          `}
        >
          <PanelBottomOpen className="size-4" />
        </Button>
      </div>
    </div>
  );
}
