"use client";

import { useEffect, useState } from "react";
import { Code2, Download, Eye, Loader2, PanelBottom, PanelLeft, PanelRight, Search, Sparkles } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import QuickOpen from "./ui/QuickOpen";
import { downloadProject } from "@/lib/api/explorerApi";
import { toast } from "sonner";

export default function PlayHeader({ roomId }: { roomId?: string }) {
  const router = useRouter();
  const panel = useLayoutstore((s) => s.panels);
  const togglePanel = useLayoutstore((s) => s.togglePanel);
  const openQuickOpen = useLayoutstore((s) => s.openQuickOpen);
  const showConfirmModal = useLayoutstore((s) => s.showConfirmModal);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadProject = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!roomId || isDownloading) return;
    setIsDownloading(true);
    const toastId = toast.loading("Packaging project archive...");
    try {
      await downloadProject(roomId);
      toast.success("Project downloaded successfully!", { id: toastId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download project";
      toast.error(message, { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const isChatOpen = panel.chat;
  const isPreviewOpen = panel.preview;
  const isTerminalOpen = panel.terminal;
  const isExplorerOpen = panel.explorer;

  // Global keyboard shortcuts for workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl+P / Cmd+P -> Quick Open (override browser print)
      if (isCtrlOrCmd && e.key.toLowerCase() === "p") {
        e.preventDefault();
        openQuickOpen("open");
        return;
      }

      // Ctrl+B / Cmd+B -> Toggle Primary Sidebar (Explorer)
      if (isCtrlOrCmd && e.key.toLowerCase() === "b") {
        e.preventDefault();
        togglePanel("explorer");
        return;
      }

      // Ctrl+` / Cmd+` -> Toggle Terminal
      if (isCtrlOrCmd && (e.key === "`" || e.key === "~" || e.code === "Backquote")) {
        e.preventDefault();
        togglePanel("terminal");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openQuickOpen, togglePanel]);

  return (
    <>
      <QuickOpen />
      <header className="flex h-9 shrink-0 select-none items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-2 text-[#cccccc] transition-colors">
        {/* Left: CodeSync Logo & VS Code Top Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              showConfirmModal({
                type: "leave",
                title: "Leave Workspace?",
                description:
                  "Are you sure you want to leave the playground and return to the dashboard? Your session will be disconnected.",
                confirmText: "Leave Workspace",
                cancelText: "Stay in Workspace",
                warningNote: "Unsaved code buffer changes or running commands will be interrupted.",
                onConfirm: () => {
                  router.push("/dashboard");
                },
              });
            }}
            title="Back to Dashboard"
            className="flex items-center gap-1.5 rounded px-1 py-1 text-xs font-semibold text-white hover:bg-[#2d2d2d] transition-colors cursor-pointer"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#007acc] text-white">
              <Code2 className="size-3.5" />
            </div>
            <span className="hidden md:inline tracking-tight font-bold">
              Code<span className="text-[#007acc]">Sync</span>
            </span>
          </Link>
        </div>

        {/* Center: Signature VS Code Command Center */}
        <div className="flex items-center justify-center flex-1 min-w-0 max-w-[150px] sm:max-w-xs md:max-w-sm mx-1.5 sm:mx-2">
          <button
            type="button"
            onClick={() => openQuickOpen("open")}
            title="Quick Open File (Ctrl+P)"
            className="w-full flex items-center justify-between h-6 px-2 sm:px-2.5 rounded bg-[#252526] hover:bg-[#2a2d2e] border border-[#3c3c3c] text-[11px] text-[#858585] hover:text-[#cccccc] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#007acc]"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Search className="w-3 h-3 text-[#858585] shrink-0" />
              <span className="truncate text-[10px] sm:text-[11px]">Quick Open</span>
            </div>
            <kbd className="hidden sm:inline px-1 rounded bg-[#313131] border border-[#3c3c3c] text-[9px] font-mono text-[#969696]">
              Ctrl+P
            </kbd>
          </button>
        </div>

        {/* Right: Layout & Panel Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">


          {/* Toggle Explorer */}
          <Button
            type="button"
            onClick={() => togglePanel("explorer")}
            variant="ghost"
            size="xs"
            title={isExplorerOpen ? "Hide Explorer" : "Open Explorer"}
            className={`h-7 w-7 p-0 rounded transition-colors ${isExplorerOpen
                ? "bg-[#2d2d2d] text-[#007acc]"
                : "text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
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
            title={isTerminalOpen ? "Hide Terminal" : "Open Terminal"}
            className={`h-7 w-7 p-0 rounded transition-colors ${isTerminalOpen
                ? "bg-[#2d2d2d] text-[#007acc]"
                : "text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
              }`}
          >
            <PanelBottom className="size-4" />
          </Button>

          {/* Toggle Preview */}
          <Button
            type="button"
            onClick={() => togglePanel("preview")}
            variant="ghost"
            size="xs"
            title={isPreviewOpen ? "Hide Live Preview" : "Open Live Preview"}
            className={`h-7 w-7 p-0 rounded transition-colors ${isPreviewOpen
                ? "bg-[#2d2d2d] text-[#3794ff]"
                : "text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
              }`}
          >
            <Eye className="size-4" />
          </Button>

          {/* Toggle Chat (AI Copilot) */}
          <Button
            type="button"
            onClick={() => togglePanel("chat")}
            variant="ghost"
            size="xs"
            title={isChatOpen ? "Hide AI Copilot Chat" : "Open AI Copilot Chat"}
            className={`h-7 w-7 p-0 rounded transition-colors ${isChatOpen
                ? "bg-[#2d2d2d] text-[#007acc]"
                : "text-[#858585] hover:bg-[#2d2d2d] hover:text-[#cccccc]"
              }`}
          >
            <Sparkles className="size-4" />
          </Button>
        </div>
      </header>
    </>
  );
}
