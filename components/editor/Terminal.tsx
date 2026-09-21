"use client";

import { memo, useEffect, useRef, useState } from "react";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { ArrowBigRight, TerminalIcon, Trash } from "lucide-react";

import { useCodestore } from "@/lib/store/Codestore";
import useSocket from "@/context/socketProvider";

const Terminal = memo(function Terminal() {
  const [userInput, setUserInput] = useState("");

  const terminalRef = useRef<HTMLDivElement>(null);

  const { applyOutput } = useSocket();

  const { outputs, activeFileId, clearOutputs, runCommand } = useCodestore();
  const code = useCodestore((s) => s.code);

  const running = activeFileId ? code[activeFileId]?.running : false;
  // AUTO SCROLL
  useEffect(() => {
    terminalRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [outputs]);

  // COMMAND
  const handleExecuteCommand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    await runCommand(userInput, activeFileId);

    const latestOutputs = useCodestore.getState().outputs;

    applyOutput(latestOutputs, userInput);

    setUserInput("");
  };

  const prompt = () => <ArrowBigRight className="w-3 h-3" />;

  return (
    <div className="relative flex h-full flex-col bg-[#181818] text-[#cccccc] font-mono text-xs overflow-hidden">
      {/* VS Code Bottom Panel Tabs */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 select-none">
        <div className="flex items-center gap-4 text-xs font-sans">

          <div className="relative flex items-center gap-1.5 text-white font-semibold text-[11px] uppercase tracking-wider cursor-pointer">
            <TerminalIcon className="size-3 text-[#007acc]" />
            <span>Terminal</span>
            <span className="absolute -bottom-2.5 inset-x-0 h-0.5 bg-[#007acc]" />
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#858585]">
          <button
            type="button"
            onClick={clearOutputs}
            title="Clear Terminal"
            className="p-1 rounded hover:bg-[#333333] hover:text-[#cccccc] transition-colors"
          >
            <Trash className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Info Banner */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1e1e1e] border-b border-[#2d2d30] text-[11px] text-[#858585] select-none font-sans">
        <span className="w-2 h-2 rounded-full bg-[#89d185]" />
        <span>CodeSync  (Node.js v20.11 runtime)</span>
      </div>

      {/* Terminal Output Area */}
      <ScrollArea.Root className="flex-1 bg-[#181818] font-mono text-[12px] overflow-hidden">
        <ScrollArea.Viewport className="h-full w-full p-3 space-y-2">
          {outputs.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] text-[#007acc]">
                <span className="text-[#89d185]">user@codesync</span>
                <span className="text-[#858585]">:</span>
                <span className="text-[#4ec9b0]">~/workspace</span>
                <span className="text-[#cccccc]">$</span>
              </div>

              <pre
                className={`whitespace-pre-wrap break-words rounded p-2 text-xs leading-relaxed ${item.error || item.stderr || item.compile_output
                  ? "bg-[#2d1517] text-[#f14c4c] border border-[#5a1d1d]"
                  : "bg-[#1f2420] text-[#89d185] border border-[#264b30]"
                  }`}
              >
                {item.stdout ||
                  item.stderr ||
                  item.compile_output ||
                  item.message ||
                  item.error}
              </pre>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleExecuteCommand} className="pt-1">
            <div className="flex items-center gap-1 text-[12px]">
              <span className="text-[#89d185]">user@codesync</span>
              <span className="text-[#858585]">:</span>
              <span className="text-[#4ec9b0]">~/workspace</span>
              <span className="text-[#cccccc]">$</span>

              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="type command..."
                className="flex-1 bg-transparent text-xs text-white placeholder:text-[#5a5a5a] outline-none ml-1 font-mono"
              />
            </div>
          </form>

          {running && (
            <div className="flex items-center gap-2 text-amber-400 text-xs pt-1">
              <span className="animate-spin">◌</span>
              <span>Executing code in container sandbox...</span>
            </div>
          )}

          <div ref={terminalRef} />
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          orientation="vertical"
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-150 w-2.5"
        >
          <ScrollArea.Thumb className="flex-1 bg-[#333333] hover:bg-[#444444] rounded-sm relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
});

export default Terminal;
