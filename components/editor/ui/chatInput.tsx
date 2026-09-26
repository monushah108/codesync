"use client";

import { ArrowUp, FileCode2, Sparkles, Square, Bot } from "lucide-react";
import { useRef } from "react";
import { useCodestore } from "@/lib/store/Codestore";
import { useAiEditStore } from "@/lib/store/useAiEditStore";
import useSocket from "@/context/socketProvider";

interface InputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: (message: string) => void;
  generating: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatInput({
  message,
  setMessage,
  onSend,
  generating,
  handleKeyDown,
}: InputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { stopAi } = useSocket();

  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFile = openFiles.find((f) => f._id === activeFileId);

  const canSend = message.trim().length > 0 && !generating;

  const handleSend = () => {
    const value = message.trim();
    if (!value || generating) return;
    onSend(value);
  };

  const handleInsertCommand = (cmd: string) => {
    if (message.startsWith(cmd)) return;
    const next = message ? `${cmd} ${message}` : `${cmd} `;
    setMessage(next);
    textareaRef.current?.focus();
  };

  return (
    <div className="shrink-0 border-t border-[#2a2a2e] bg-[#171719] p-3 space-y-2.5 select-none">
      {/* Quick Action Chips & Active Context */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {activeFile && (
            <div
              title={`Active context: ${activeFile.name}`}
              className="flex items-center gap-1 rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-sky-300 text-[10px]"
            >
              <FileCode2 className="size-3 text-sky-400 shrink-0" />
              <span className="max-w-28 truncate font-mono text-sky-200">
                {activeFile.name}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleInsertCommand("/explain")}
            className="rounded-md border border-[#2e2e34] bg-[#202024] px-2 py-0.5 font-mono text-[10px] text-[#9a9aa2] transition-all hover:border-sky-500/60 hover:bg-[#27272e] hover:text-white cursor-pointer"
          >
            /explain
          </button>
          <button
            type="button"
            onClick={() => handleInsertCommand("/fix")}
            className="rounded-md border border-[#2e2e34] bg-[#202024] px-2 py-0.5 font-mono text-[10px] text-[#9a9aa2] transition-all hover:border-sky-500/60 hover:bg-[#27272e] hover:text-white cursor-pointer"
          >
            /fix
          </button>
          <button
            type="button"
            onClick={() => handleInsertCommand("/tests")}
            className="rounded-md border border-[#2e2e34] bg-[#202024] px-2 py-0.5 font-mono text-[10px] text-[#9a9aa2] transition-all hover:border-sky-500/60 hover:bg-[#27272e] hover:text-white cursor-pointer"
          >
            /tests
          </button>
        </div>
      </div>

      {/* VS Code Copilot Input Box */}
      <div className="relative rounded-lg border border-[#34343b] bg-[#1e1e22] shadow-sm transition-all focus-within:border-[#007acc] focus-within:ring-1 focus-within:ring-[#007acc]/40">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={generating}
          rows={2}
          placeholder={
            generating
              ? "CodeSync Copilot is thinking..."
              : "Ask CodeSync Copilot or type / for commands..."
          }
          className="block w-full min-h-[54px] max-h-36 resize-none bg-transparent px-3 py-2.5 text-xs leading-relaxed text-[#dedede] placeholder:text-[#6a6a72] outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Bottom Toolbar inside the box */}
        <div className="flex items-center justify-between border-t border-[#2a2a2f] px-2.5 py-1.5 text-[11px] text-[#858585]">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#8a8a92]">
              <Sparkles className="size-3 text-[#007acc]" />
              <span>Copilot-4o</span>
            </span>
          </div>

          {generating ? (
            <button
              type="button"
              onClick={stopAi}
              title="Stop AI Generation"
              className="flex size-6.5 items-center justify-center rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 active:scale-95 shadow-sm cursor-pointer"
            >
              <Square className="size-3 fill-red-400" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              title={generating ? "Generating..." : "Send prompt (Enter)"}
              className={`flex size-6.5 items-center justify-center rounded-md transition-all ${
                canSend
                  ? "bg-[#007acc] text-white hover:bg-[#008be6] active:scale-95 shadow-sm cursor-pointer"
                  : "bg-[#28282d] text-[#55555c] cursor-not-allowed"
              }`}
            >
              <ArrowUp className="size-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Hints */}
      <div className="flex items-center justify-between text-[10px] text-[#63636b] px-0.5">
        <span>Enter to send · Shift + Enter for new line</span>
        <span>Markdown enabled</span>
      </div>
    </div>
  );
}
