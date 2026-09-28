"use client";

import { ArrowUp, FileCode2, Sparkles, Square, Bot, Zap } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCodestore } from "@/lib/store/Codestore";
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
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFile = openFiles.find((f) => f._id === activeFileId);

  const hasBotMention = /(^|\s)@bot\b/i.test(message);
  const canSend = message.trim().length > 0 && !generating;

  // Detect if user is typing "@"
  useEffect(() => {
    const match = /(?:^|\s)@([a-zA-Z0-9]*)$/.exec(message);
    if (match) {
      const query = match[1]?.toLowerCase() ?? "";
      if ("bot".startsWith(query)) {
        setShowMentionMenu(true);
        return;
      }
    }
    setShowMentionMenu(false);
  }, [message]);

  const handleSend = () => {
    const value = message.trim();
    if (!value || generating) return;
    onSend(value);
  };

  const handleInsertBot = () => {
    setShowMentionMenu(false);
    if (hasBotMention) {
      textareaRef.current?.focus();
      return;
    }

    const next = message.trim() ? `@bot ${message.trim()} ` : "@bot ";
    setMessage(next);
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, 10);
  };

  const handleMentionSelect = () => {
    // Replace the trailing @ query with @bot
    const updated = message.replace(/(?:^|\s)@([a-zA-Z0-9]*)$/, (match) => {
      return match.startsWith(" ") ? " @bot " : "@bot ";
    });
    setMessage(updated);
    setShowMentionMenu(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  };

  const onKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showMentionMenu && (e.key === "Tab" || e.key === "Enter")) {
      e.preventDefault();
      handleMentionSelect();
      return;
    }
    if (e.key === "Escape" && showMentionMenu) {
      e.preventDefault();
      setShowMentionMenu(false);
      return;
    }
    handleKeyDown(e);
  };

  return (
    <div className="shrink-0 border-t border-[#2a2a2e] bg-[#171719] p-3 space-y-2 select-none relative">
      {/* Floating Mention Autocomplete Popup */}
      {showMentionMenu && (
        <div className="absolute -top-14 left-3 right-3 z-50 rounded-lg border border-purple-500/30 bg-[#1e1e24] p-1.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <button
            type="button"
            onClick={handleMentionSelect}
            className="w-full flex items-center justify-between rounded-md bg-purple-500/15 border border-purple-500/30 px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-purple-500/25 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-semibold text-purple-300">@bot</span>
                <span className="text-[10px] text-zinc-400">· CodeSync AI Pair Programmer</span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-purple-300/80 bg-purple-500/20 px-1.5 py-0.5 rounded">
              Tab ↵
            </span>
          </button>
        </div>
      )}

      {/* Top Context & Bot Quick Chip Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {activeFile && (
            <div
              title={`Active context: ${activeFile.name}`}
              className="flex items-center gap-1 rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 text-sky-300 text-[10px]"
            >
              <FileCode2 className="size-3 text-sky-400 shrink-0" />
              <span className="max-w-32 truncate font-mono text-sky-200">
                {activeFile.name}
              </span>
            </div>
          )}

          {/* Quick @bot Mention Button */}
          <button
            type="button"
            onClick={handleInsertBot}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[10px] font-mono transition-all cursor-pointer ${
              hasBotMention
                ? "bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                : "border border-[#2e2e34] bg-[#202024] text-[#9a9aa2] hover:border-purple-500/50 hover:bg-[#27272e] hover:text-white"
            }`}
          >
            <Bot className={`size-3 ${hasBotMention ? "text-purple-400" : "text-[#7a7a82]"}`} />
            <span>@bot</span>
            {hasBotMention && (
              <span className="size-1.5 rounded-full bg-purple-400 animate-pulse" />
            )}
          </button>
        </div>

        {hasBotMention && (
          <div className="flex items-center gap-1 text-[10px] text-purple-300 font-mono shrink-0">
            <Sparkles className="size-2.5 text-purple-400" />
            <span>AI Mode Active</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div
        className={`relative rounded-lg border bg-[#1e1e22] shadow-sm transition-all ${
          hasBotMention
            ? "border-purple-500/50 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/30"
            : "border-[#34343b] focus-within:border-[#007acc] focus-within:ring-1 focus-within:ring-[#007acc]/40"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDownInternal}
          disabled={generating}
          rows={2}
          placeholder={
            generating
              ? "CodeSync AI is generating..."
              : hasBotMention
              ? "Ask @bot to write, edit, or explain code..."
              : "Message room, or type @bot to ask AI..."
          }
          className="block w-full min-h-[54px] max-h-36 resize-none bg-transparent px-3 py-2.5 text-xs leading-relaxed text-[#dedede] placeholder:text-[#6a6a72] outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Bottom Toolbar inside the box */}
        <div className="flex items-center justify-between border-t border-[#2a2a2f] px-2.5 py-1.5 text-[11px] text-[#858585]">
          <div className="flex items-center gap-1.5">
            {hasBotMention ? (
              <span className="flex items-center gap-1 rounded bg-purple-500/10 border border-purple-500/25 px-1.5 py-0.5 text-[9px] font-mono text-purple-300">
                <Sparkles className="size-2.5 text-purple-400" />
                <span>@bot Invoked</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#8a8a92]">
                <Bot className="size-3 text-[#6a6a72]" />
                <span>Type @bot to invoke AI</span>
              </span>
            )}
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
              title={generating ? "Generating..." : "Send (Enter)"}
              className={`flex size-6.5 items-center justify-center rounded-md transition-all ${
                canSend
                  ? hasBotMention
                    ? "bg-purple-600 text-white hover:bg-purple-500 active:scale-95 shadow-sm cursor-pointer"
                    : "bg-[#007acc] text-white hover:bg-[#008be6] active:scale-95 shadow-sm cursor-pointer"
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
        <span>Use @bot for AI pair programming</span>
      </div>
    </div>
  );
}
