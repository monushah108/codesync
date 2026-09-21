"use client";

import { ArrowUp, FileCode2, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useCodestore } from "@/lib/store/Codestore";

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
    <div className="shrink-0 border-t border-[#2d2d30] bg-[#181818] p-3 space-y-2 select-none">
      {/* Quick Action Chips & Active Context */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {activeFile && (
            <div
              title={`Active context: ${activeFile.name}`}
              className="flex items-center gap-1 rounded-sm border border-[#2d2d30] bg-[#252526] px-2 py-0.5 text-[#858585] text-[10px]"
            >
              <FileCode2 className="size-3 text-[#007acc] shrink-0" />
              <span className="max-w-28 truncate font-mono text-[#cccccc]">
                {activeFile.name}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleInsertCommand("/explain")}
            className="rounded-sm border border-[#2d2d30] bg-[#252526] px-1.5 py-0.5 font-mono text-[10px] text-[#858585] transition-colors hover:border-[#007acc] hover:text-[#cccccc]"
          >
            /explain
          </button>
          <button
            type="button"
            onClick={() => handleInsertCommand("/fix")}
            className="rounded-sm border border-[#2d2d30] bg-[#252526] px-1.5 py-0.5 font-mono text-[10px] text-[#858585] transition-colors hover:border-[#007acc] hover:text-[#cccccc]"
          >
            /fix
          </button>
          <button
            type="button"
            onClick={() => handleInsertCommand("/tests")}
            className="rounded-sm border border-[#2d2d30] bg-[#252526] px-1.5 py-0.5 font-mono text-[10px] text-[#858585] transition-colors hover:border-[#007acc] hover:text-[#cccccc]"
          >
            /tests
          </button>
        </div>
      </div>

      {/* VS Code Copilot Input Box */}
      <div className="relative rounded-sm border border-[#3c3c3c] bg-[#252526] transition-colors focus-within:border-[#007acc]">
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
          className="block w-full min-h-[52px] max-h-36 resize-none bg-transparent px-3 py-2.5 text-xs leading-relaxed text-[#cccccc] placeholder:text-[#6e7681] outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Bottom Toolbar inside the box */}
        <div className="flex items-center justify-between border-t border-[#2d2d30] px-2.5 py-1.5 text-[11px] text-[#858585]">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#858585]">
              <Sparkles className="size-3 text-[#007acc]" />
              <span>Copilot-4o</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            title={generating ? "Generating..." : "Send prompt (Enter)"}
            className={`flex size-6 items-center justify-center rounded-sm transition-all ${
              canSend
                ? "bg-[#007acc] text-white hover:bg-[#006bb3]"
                : "bg-[#333333] text-[#6e7681] cursor-not-allowed"
            }`}
          >
            {generating ? (
              <span className="size-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <ArrowUp className="size-3.5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Footer Hints */}
      <div className="flex items-center justify-between text-[10px] text-[#6e7681] px-0.5">
        <span>Enter to send · Shift + Enter for new line</span>
        <span>Markdown enabled</span>
      </div>
    </div>
  );
}
