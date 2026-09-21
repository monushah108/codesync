"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  FolderTree,
  Search,
  Terminal,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SandpackFile, VirtualFileSystem } from "@/lib/features";
import { isTrustedSandboxOrigin, useSandboxConsole } from "@/components/editor/preview/sandpackPreview";
import VirtualFSInspector from "../virtualIns";

export type TerminalHistory = {
  id: string;
  type: "input" | "output" | "error" | "info" | "system";
  text: string;
};

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vfs: VirtualFileSystem;
}

export default function BottomDrawer({
  isOpen,
  onClose,
  vfs,
}: BottomDrawerProps) {
  const { sandpack } = useSandpack();

  const [activeTab, setActiveTab] = useState<"terminal" | "console" | "vfs">("terminal");
  const [drawerHeight, setDrawerHeight] = useState(240);
  const [isMaximized, setIsMaximized] = useState(false);
  const isDraggingRef = useRef(false);

  // Console state
  const { logs, clear: clearLogs } = useSandboxConsole();
  const [logFilter, setLogFilter] = useState<"all" | "error" | "warn" | "log">("all");
  const [logSearch, setLogSearch] = useState("");

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalHistory[]>([
    {
      id: "init-1",
      type: "system",
      text: `Sandpack Terminal v2.0 ready [Template: ${vfs.template}]. Type 'help' for commands.`,
    },
  ]);
  const [historyPointer, setHistoryPointer] = useState<number | null>(null);
  const [commandList, setCommandList] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal
  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalHistory, activeTab]);

  // Handle drawer resize via mouse drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight >= 120 && newHeight <= window.innerHeight * 0.8) {
        setDrawerHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Evaluate command in terminal
  const executeTerminalCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim();
    if (!cmd) return;

    setCommandList((prev) => [...prev, cmd]);
    setHistoryPointer(null);

    const inputEntry: TerminalHistory = {
      id: `in-${Date.now()}-${Math.random()}`,
      type: "input",
      text: cmd,
    };

    if (cmd === "clear" || cmd === "cls") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    }

    if (cmd === "help") {
      setTerminalHistory((prev) => [
        ...prev,
        inputEntry,
        {
          id: `out-${Date.now()}`,
          type: "info",
          text: `Available Terminal Commands:
  • help            : Show this list of available commands
  • ls / dir        : List all virtual files mounted in the sandbox
  • cat <file>      : Display the content of a virtual file
  • eval <expr>     : Evaluate JavaScript expression in sandbox runtime
  • restart / run   : Reload the sandbox bundler and preview
  • stats           : Display virtual file system and template statistics
  • clear / cls     : Clear the terminal output`,
        },
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd === "ls" || cmd === "dir") {
      const filesSummary = (Object.entries(vfs.files) as [string, SandpackFile][])
        .map(([path, f]) => {
          const isSynth = f.isSynthesized ? " (synthesized)" : "";
          return `  ${path.padEnd(28)} ${String(f.code.length).padStart(7)} bytes${isSynth}`;
        })
        .join("\n");

      setTerminalHistory((prev) => [
        ...prev,
        inputEntry,
        {
          id: `out-${Date.now()}`,
          type: "output",
          text: `Virtual Filesystem (${vfs.totalFiles} files, ${vfs.totalBytes} bytes):\n${filesSummary}`,
        },
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd.startsWith("cat ")) {
      const targetPath = cmd.slice(4).trim();
      const normalizedPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
      const targetFile = vfs.files[normalizedPath];

      if (targetFile) {
        setTerminalHistory((prev) => [
          ...prev,
          inputEntry,
          {
            id: `out-${Date.now()}`,
            type: "output",
            text: `[${normalizedPath}]\n${targetFile.code}`,
          },
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          inputEntry,
          {
            id: `out-${Date.now()}`,
            type: "error",
            text: `File not found in VFS: "${targetPath}". Type 'ls' to see available files.`,
          },
        ]);
      }
      setTerminalInput("");
      return;
    }

    if (cmd === "restart" || cmd === "run" || cmd === "reload") {
      sandpack.runSandpack();
      setTerminalHistory((prev) => [
        ...prev,
        inputEntry,
        {
          id: `out-${Date.now()}`,
          type: "system",
          text: `Restarting sandbox runtime... Preview updated.`,
        },
      ]);
      setTerminalInput("");
      return;
    }

    if (cmd === "stats") {
      setTerminalHistory((prev) => [
        ...prev,
        inputEntry,
        {
          id: `out-${Date.now()}`,
          type: "info",
          text: `Virtual File System Stats:
  • Template     : ${vfs.template}
  • Total Files  : ${vfs.totalFiles}
  • Total Size   : ${vfs.totalBytes} bytes
  • HTML Pages   : ${vfs.htmlFiles.join(", ") || "none"}
  • Dependencies : ${Object.keys(vfs.dependencies).length > 0
              ? Object.entries(vfs.dependencies)
                .map(([k, v]) => `${k}@${v}`)
                .join(", ")
              : "none"
            }
  • Status       : ${sandpack.status}`,
        },
      ]);
      setTerminalInput("");
      return;
    }

    // Direct Evaluation (eval <code> or direct expressions)
    const codeToEval = cmd.startsWith("eval ") ? cmd.slice(5).trim() : cmd;
    const reqId = `${Date.now()}-${Math.random()}`;

    const handleEvalResponse = (event: MessageEvent) => {
      if (!isTrustedSandboxOrigin(event)) return;

      const data = event.data;
      if (!data || data.source !== "sandbox-eval-result" || data.id !== reqId) return;
      window.removeEventListener("message", handleEvalResponse);

      setTerminalHistory((prev) => [
        ...prev,
        {
          id: `eval-${Date.now()}`,
          type: data.success ? "output" : "error",
          text: data.success ? String(data.result) : `Error: ${data.error}`,
        },
      ]);
    };

    window.addEventListener("message", handleEvalResponse);

    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      try {
        let targetOrigin = "*";
        if (iframe.src) {
          try {
            const parsed = new URL(iframe.src);
            if (parsed.origin && parsed.origin !== "null") {
              targetOrigin = parsed.origin;
            }
          } catch { }
        }

        iframe.contentWindow?.postMessage(
          {
            source: "sandbox-eval-request",
            id: reqId,
            code: codeToEval,
          },
          targetOrigin
        );
      } catch { }
    });

    setTerminalHistory((prev) => [...prev, inputEntry]);
    setTerminalInput("");
  };

  const handleKeyDownTerminal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeTerminalCommand(terminalInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandList.length === 0) return;
      const nextIndex =
        historyPointer === null
          ? commandList.length - 1
          : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextIndex);
      setTerminalInput(commandList[nextIndex] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer === null) return;
      const nextIndex = historyPointer + 1;
      if (nextIndex >= commandList.length) {
        setHistoryPointer(null);
        setTerminalInput("");
      } else {
        setHistoryPointer(nextIndex);
        setTerminalInput(commandList[nextIndex] || "");
      }
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      if (logFilter !== "all" && item.method !== logFilter) return false;
      if (logSearch.trim()) {
        return item.text.toLowerCase().includes(logSearch.toLowerCase());
      }
      return true;
    });
  }, [logs, logFilter, logSearch]);

  const errorCount = useMemo(
    () => logs.filter((l) => l.method === "error").length,
    [logs]
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        height: isMaximized ? "75%" : `${drawerHeight}px`,
      }}
      className="relative flex shrink-0 flex-col overflow-hidden border-t border-[#2d2d30] bg-[#181818] text-[#cccccc] shadow-2xl transition-all"
    >
      {/* Drag handle */}
      <div
        onMouseDown={() => {
          isDraggingRef.current = true;
        }}
        className="group absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-[#007acc] transition-colors z-20 flex justify-center items-center"
      >
        <div className="h-0.5 w-10 rounded-full bg-[#444] group-hover:bg-white" />
      </div>

      {/* Drawer Header & Tabs */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#202020] px-2">
        <div className="flex items-center gap-1">
          {/* Terminal Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${activeTab === "terminal"
              ? "bg-[#2d2d30] text-white border-b-2 border-[#007acc]"
              : "text-[#858585] hover:text-[#cccccc] hover:bg-[#282828]"
              }`}
          >
            <Terminal className="size-3" />
            Terminal
          </button>

          {/* Console Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${activeTab === "console"
              ? "bg-[#2d2d30] text-white border-b-2 border-[#007acc]"
              : "text-[#858585] hover:text-[#cccccc] hover:bg-[#282828]"
              }`}
          >
            <Code2 className="size-3" />
            Console
            {errorCount > 0 && (
              <span className="rounded-full bg-red-500/20 px-1.5 py-0.2 text-[9px] font-bold text-red-400">
                {errorCount}
              </span>
            )}
          </button>

          {/* Virtual FS Inspector Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("vfs")}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-sm transition-colors ${activeTab === "vfs"
              ? "bg-[#2d2d30] text-white border-b-2 border-[#007acc]"
              : "text-[#858585] hover:text-[#cccccc] hover:bg-[#282828]"
              }`}
          >
            <FolderTree className="size-3" />
            Virtual FS
            <span className="text-[10px] text-[#858585]">({vfs.totalFiles})</span>
          </button>
        </div>

        {/* Drawer Window Controls */}
        <div className="flex items-center gap-1">
          {activeTab === "terminal" && (
            <Button
              variant="ghost"
              size="icon"
              title="Clear Terminal"
              className="size-6 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
              onClick={() => setTerminalHistory([])}
            >
              <Trash2 className="size-3" />
            </Button>
          )}

          {activeTab === "console" && (
            <Button
              variant="ghost"
              size="icon"
              title="Clear Console"
              className="size-6 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
              onClick={clearLogs}
            >
              <Trash2 className="size-3" />
            </Button>
          )}

          {/* Maximize Drawer */}
          <Button
            variant="ghost"
            size="icon"
            title={isMaximized ? "Restore Height" : "Maximize Drawer"}
            className="size-6 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            onClick={() => setIsMaximized((prev) => !prev)}
          >
            {isMaximized ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronUp className="size-3.5" />
            )}
          </Button>

          {/* Close Drawer */}
          <Button
            variant="ghost"
            size="icon"
            title="Close"
            className="size-6 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
            onClick={onClose}
          >
            <X className="size-3" />
          </Button>
        </div>
      </div>

      {/* Drawer Tab Contents */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* ---------------- TAB 1: TERMINAL ---------------- */}
        {activeTab === "terminal" && (
          <div className="flex-1 min-h-0 flex flex-col font-mono text-xs bg-[#121212]">
            {/* Suggestions Bar */}
            <div className="flex items-center gap-2 border-b border-[#252526] px-3 py-1 bg-[#1a1a1a] text-[11px] text-[#858585] overflow-x-auto">
              <span>Quick commands:</span>
              <button
                onClick={() => executeTerminalCommand("help")}
                className="rounded bg-[#252526] px-1.5 py-0.5 text-[#007acc] hover:bg-[#333333] hover:text-white transition-colors"
              >
                help
              </button>
              <button
                onClick={() => executeTerminalCommand("ls")}
                className="rounded bg-[#252526] px-1.5 py-0.5 text-[#007acc] hover:bg-[#333333] hover:text-white transition-colors"
              >
                ls
              </button>
              <button
                onClick={() => executeTerminalCommand("stats")}
                className="rounded bg-[#252526] px-1.5 py-0.5 text-[#007acc] hover:bg-[#333333] hover:text-white transition-colors"
              >
                stats
              </button>
              <button
                onClick={() => executeTerminalCommand("restart")}
                className="rounded bg-[#252526] px-1.5 py-0.5 text-[#007acc] hover:bg-[#333333] hover:text-white transition-colors"
              >
                restart
              </button>
              <button
                onClick={() => executeTerminalCommand("clear")}
                className="rounded bg-[#252526] px-1.5 py-0.5 text-[#858585] hover:bg-[#333333] hover:text-white transition-colors"
              >
                clear
              </button>
            </div>

            {/* Output log */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1 select-text">
              {terminalHistory.map((item) => (
                <div key={item.id} className="leading-5 break-words">
                  {item.type === "input" && (
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <span className="text-[#007acc] font-bold">❯</span>
                      <span>{item.text}</span>
                    </div>
                  )}
                  {item.type === "output" && (
                    <pre className="whitespace-pre-wrap text-[#d4d4d4] pl-4 font-mono">
                      {item.text}
                    </pre>
                  )}
                  {item.type === "error" && (
                    <pre className="whitespace-pre-wrap text-red-400 pl-4 font-mono">
                      {item.text}
                    </pre>
                  )}
                  {item.type === "info" && (
                    <pre className="whitespace-pre-wrap text-sky-300 pl-4 font-mono">
                      {item.text}
                    </pre>
                  )}
                  {item.type === "system" && (
                    <div className="text-[#757575] pl-4 italic">
                      {item.text}
                    </div>
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Input Prompt */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeTerminalCommand(terminalInput);
              }}
              className="flex items-center gap-2 border-t border-[#252526] bg-[#181818] px-3 py-1.5"
            >
              <span className="text-[#007acc] font-bold">❯</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleKeyDownTerminal}
                placeholder="Enter command or JS expression (e.g. ls, help, eval 2+2)..."
                className="flex-1 bg-transparent text-xs text-[#ffffff] outline-none placeholder:text-[#555555] font-mono"
                autoFocus
              />
              <Button
                size="xs"
                variant="ghost"
                type="submit"
                className="h-6 px-2 text-[10px] text-[#007acc] hover:bg-[#252526]"
              >
                Run
              </Button>
            </form>
          </div>
        )}

        {/* ---------------- TAB 2: CONSOLE ---------------- */}
        {activeTab === "console" && (
          <div className="flex-1 min-h-0 flex flex-col font-mono text-xs bg-[#181818]">
            {/* Console Filter Bar */}
            <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] px-2 bg-[#202020]">
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setLogFilter("all")}
                  className={`px-2 py-0.5 rounded ${logFilter === "all"
                    ? "bg-[#333333] text-white"
                    : "text-[#858585] hover:text-white"
                    }`}
                >
                  All ({logs.length})
                </button>
                <button
                  onClick={() => setLogFilter("error")}
                  className={`px-2 py-0.5 rounded ${logFilter === "error"
                    ? "bg-red-500/20 text-red-400"
                    : "text-[#858585] hover:text-red-400"
                    }`}
                >
                  Errors ({logs.filter((l) => l.method === "error").length})
                </button>
                <button
                  onClick={() => setLogFilter("warn")}
                  className={`px-2 py-0.5 rounded ${logFilter === "warn"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "text-[#858585] hover:text-yellow-400"
                    }`}
                >
                  Warnings ({logs.filter((l) => l.method === "warn").length})
                </button>
                <button
                  onClick={() => setLogFilter("log")}
                  className={`px-2 py-0.5 rounded ${logFilter === "log"
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-[#858585] hover:text-blue-400"
                    }`}
                >
                  Info ({logs.filter((l) => l.method === "log" || l.method === "info").length})
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 rounded bg-[#181818] border border-[#333333] px-2 py-0.5 text-[11px]">
                  <Search className="size-3 text-[#666666]" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Filter logs..."
                    className="w-24 sm:w-32 bg-transparent outline-none text-[#cccccc] placeholder:text-[#555555]"
                  />
                </div>
              </div>
            </div>

            {/* Console Log Stream */}
            <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1 select-text">
              {filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6 text-[#555555]">
                  <Code2 className="size-6 mb-1 text-[#444444]" />
                  <span>No console logs recorded yet.</span>
                  <span className="text-[10px] text-[#444444]">
                    Logs emitted from console.log or runtime errors will appear here.
                  </span>
                </div>
              ) : (
                filteredLogs.map((entry) => (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-2 py-1 px-1.5 rounded text-[11px] leading-5 font-mono border-b border-[#232323] ${entry.method === "error"
                      ? "bg-red-950/20 text-red-400"
                      : entry.method === "warn"
                        ? "bg-yellow-950/20 text-yellow-300"
                        : "text-[#cccccc]"
                      }`}
                  >
                    <span className="text-[10px] text-[#666666] shrink-0 font-sans">
                      {entry.timestamp}
                    </span>
                    <span
                      className={`uppercase text-[9px] font-bold px-1 rounded shrink-0 ${entry.method === "error"
                        ? "bg-red-500/20 text-red-400"
                        : entry.method === "warn"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                      {entry.method}
                    </span>
                    <pre className="whitespace-pre-wrap break-words flex-1 font-mono">
                      {entry.text}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: VIRTUAL FS INSPECTOR ---------------- */}
        {activeTab === "vfs" && (
          <VirtualFSInspector vfs={vfs} />
        )}
      </div>
    </div>
  );
}
