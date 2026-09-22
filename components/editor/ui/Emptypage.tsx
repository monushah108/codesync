"use client";

import { useEffect, useState } from "react";
import { Code2, FileCode2, PanelLeft, Search, Terminal } from "lucide-react";
import { useLayoutstore } from "@/lib/store/Layoutstore";

interface EmptyPageProps {
  roomId?: string;
}

function EmptyPage({ roomId }: EmptyPageProps) {
  const openQuickOpen = useLayoutstore((s) => s.openQuickOpen);
  const togglePanel = useLayoutstore((s) => s.togglePanel);

  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent),
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Quick Open (Ctrl+P / Cmd+P)
      if (isCtrlOrCmd && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
        openQuickOpen("open");
        return;
      }

      // Toggle Terminal (Ctrl+` / Cmd+`)
      if (isCtrlOrCmd && (e.key === "`" || e.key === "~" || e.code === "Backquote")) {
        e.preventDefault();
        e.stopPropagation();
        togglePanel("terminal");
        return;
      }

      // Find in File (Ctrl+F / Cmd+F)
      if (isCtrlOrCmd && e.key.toLowerCase() === "f") {
        e.preventDefault();
        e.stopPropagation();
        openQuickOpen("find");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openQuickOpen, togglePanel]);

  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#1e1e1e] p-6 text-center select-none">
      {/* VS Code Watermark Logo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#252526] border border-[#2d2d30] text-[#007acc] shadow-inner mb-6">
        <Code2 className="h-8 w-8" strokeWidth={1.5} />
      </div>

      <h3 className="text-sm font-semibold text-[#cccccc] tracking-tight mb-1">
        CodeSync Editor
      </h3>
      <p className="text-xs text-[#858585] max-w-sm mb-6">
        Select a file from the explorer on the left or use keyboard shortcuts to get started.
      </p>

      {/* VS Code Shortcut Cheatsheet */}
      <div className="w-full max-w-xs space-y-2 text-left">
        {/* Open File Explorer */}
        <button
          type="button"
          onClick={() => togglePanel("explorer")}
          className="group flex w-full items-center justify-between text-xs py-1.5 px-2.5 rounded-md hover:bg-[#252526] active:bg-[#2d2d2d] transition-colors cursor-pointer border border-transparent hover:border-[#3c3c3c]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
          title="Open Explorer"
        >
          <span className="text-[#858585] group-hover:text-[#cccccc] flex items-center gap-2 transition-colors">
            <PanelLeft className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Open File Explorer</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#2d2d2d] group-hover:bg-[#333333] border border-[#3c3c3c] group-hover:border-[#4a4a4a] text-[10px] font-mono text-[#007acc] transition-colors">
            Files
          </span>
        </button>

        {/* Quick Open File */}
        <button
          type="button"
          onClick={() => openQuickOpen("open")}
          className="group flex w-full items-center justify-between text-xs py-1.5 px-2.5 rounded-md hover:bg-[#252526] active:bg-[#2d2d2d] transition-colors cursor-pointer border border-transparent hover:border-[#3c3c3c]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
          title={`Quick Open File (${modKey} + P)`}
        >
          <span className="text-[#858585] group-hover:text-[#cccccc] flex items-center gap-2 transition-colors">
            <FileCode2 className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Quick Open File</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] group-hover:bg-[#333333] border border-[#3c3c3c] group-hover:border-[#4a4a4a] text-[10px] font-mono text-[#cccccc] transition-colors">
            {modKey} + P
          </kbd>
        </button>

        {/* Toggle Terminal */}
        <button
          type="button"
          onClick={() => togglePanel("terminal")}
          className="group flex w-full items-center justify-between text-xs py-1.5 px-2.5 rounded-md hover:bg-[#252526] active:bg-[#2d2d2d] transition-colors cursor-pointer border border-transparent hover:border-[#3c3c3c]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
          title={`Toggle Terminal (${modKey} + \`)`}
        >
          <span className="text-[#858585] group-hover:text-[#cccccc] flex items-center gap-2 transition-colors">
            <Terminal className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Toggle Terminal</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] group-hover:bg-[#333333] border border-[#3c3c3c] group-hover:border-[#4a4a4a] text-[10px] font-mono text-[#cccccc] transition-colors">
            {modKey} + `
          </kbd>
        </button>

        {/* Find in File */}
        <button
          type="button"
          onClick={() => openQuickOpen("find")}
          className="group flex w-full items-center justify-between text-xs py-1.5 px-2.5 rounded-md hover:bg-[#252526] active:bg-[#2d2d2d] transition-colors cursor-pointer border border-transparent hover:border-[#3c3c3c]/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
          title={`Find in File (${modKey} + F)`}
        >
          <span className="text-[#858585] group-hover:text-[#cccccc] flex items-center gap-2 transition-colors">
            <Search className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Find in File</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] group-hover:bg-[#333333] border border-[#3c3c3c] group-hover:border-[#4a4a4a] text-[10px] font-mono text-[#cccccc] transition-colors">
            {modKey} + F
          </kbd>
        </button>
      </div>
    </div>
  );
}

export default EmptyPage;
