"use client";

import { Code2, PanelBottom, PanelLeft, PanelRight, Search, Sparkles } from "lucide-react";
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
    <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-2.5 text-[#cccccc] transition-colors">
      {/* Left: CodeSync Logo & VS Code Top Menu */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          title="Back to Dashboard"
          className="flex items-center gap-1.5 rounded px-1.5 py-1 text-xs font-semibold text-white hover:bg-[#2d2d2d] transition-colors"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded bg-[#007acc] text-white">
            <Code2 className="size-3.5" />
          </div>
          <span className="hidden sm:inline tracking-tight font-bold">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
        </Link>


      </div>

      {/* Center: Signature VS Code Command Center */}
      <div className="flex items-center justify-center flex-1 max-w-sm mx-2">
        <div className="w-full flex items-center justify-between h-6 px-2.5 rounded bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] text-[11px] text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer">
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3 h-3 text-[#858585] shrink-0" />
            <span className="truncate">CodeSync Workspace</span>
          </div>
          <kbd className="hidden sm:inline px-1 rounded bg-[#313131] border border-[#3c3c3c] text-[9px] font-mono text-[#969696]">
            Ctrl+P
          </kbd>
        </div>
      </div>

      {/* Right: Layout & Panel Controls */}
      <div className="flex items-center gap-1">
        {/* Toggle Explorer */}
        <Button
          type="button"
          onClick={() => togglePanel("explorer")}
          variant="ghost"
          size="xs"
          title={isExplorerOpen ? "Hide Primary Side Bar" : "Show Primary Side Bar"}
          className={`h-7 w-7 p-0 rounded hover:bg-[#2d2d2d] ${isExplorerOpen ? "bg-[#2d2d2d] text-[#007acc]" : "text-[#858585] hover:text-[#cccccc]"
            }`}
        >
          <PanelLeft className="size-4" />
        </Button>

        {/* Toggle Terminal / Panel */}
        <Button
          type="button"
          onClick={() => togglePanel("terminal")}
          variant="ghost"
          size="xs"
          title={isTerminalOpen ? "Toggle Panel (Terminal)" : "Show Panel (Terminal)"}
          className={`h-7 w-7 p-0 rounded hover:bg-[#2d2d2d] ${isTerminalOpen ? "bg-[#2d2d2d] text-[#007acc]" : "text-[#858585] hover:text-[#cccccc]"
            }`}
        >
          <PanelBottom className="size-4" />
        </Button>

        {/* Toggle Secondary Side Bar (Chat / Preview) */}
        <Button
          type="button"
          onClick={() => togglePanel("chat")}
          variant="ghost"
          size="xs"
          title={isChatOpen ? "Hide Secondary Side Bar (Chat)" : "Show Secondary Side Bar (Chat)"}
          className={`h-7 w-7 p-0 rounded hover:bg-[#2d2d2d] ${isChatOpen ? "bg-[#2d2d2d] text-[#007acc]" : "text-[#858585] hover:text-[#cccccc]"
            }`}
        >
          <PanelRight className="size-4" />
        </Button>
      </div>
    </header>
  );
}
