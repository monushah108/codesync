"use client";

import { Bug, Code2, FileCode2, Sparkles, TestTube2, Wand2, Bot } from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";

interface EmptyChatProps {
  onPromptClick?: (prompt: string) => void;
}

export default function EmptyChat({ onPromptClick }: EmptyChatProps) {
  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFile = openFiles.find((f) => f._id === activeFileId);

  const suggestions = [
    {
      label: "Explain this code",
      description: activeFile ? `Explain logic in ${activeFile.name}` : "Explain the current workspace code",
      icon: Code2,
      prompt: activeFile ? `@bot Explain the logic and architecture of ${activeFile.name}` : "@bot Explain how this code works step by step",
    },
    {
      label: "Find & fix bugs",
      description: "Analyze code for potential errors and surgical fixes",
      icon: Bug,
      prompt: activeFile ? `@bot Review ${activeFile.name} and fix any bugs or edge cases` : "@bot Find and fix potential bugs in this code",
    },
    {
      label: "Generate unit tests",
      description: "Write comprehensive test cases and mocks",
      icon: TestTube2,
      prompt: activeFile ? `@bot Generate comprehensive unit tests for ${activeFile.name}` : "@bot Generate unit tests for this code",
    },
    {
      label: "Optimize & refactor",
      description: "Improve performance, readability, and clean code",
      icon: Wand2,
      prompt: activeFile ? `@bot Refactor ${activeFile.name} for optimal performance and readability` : "@bot Refactor this code for readability and performance",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between p-4 select-none">
      <div className="space-y-4">
        {/* Header Badge */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300">
            <Bot className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span>CodeSync Copilot</span>
              <span className="rounded bg-purple-500/20 px-1 py-0.2 font-mono text-[9px] text-purple-300 border border-purple-500/30">
                @bot
              </span>
            </h3>
            <p className="text-[11px] text-[#858585]">
              Use @bot to chat, ask questions, or edit code in real time
            </p>
          </div>
        </div>

        {/* Active Context Banner */}
        {activeFile && (
          <div className="flex items-center gap-2 rounded-md border border-[#2d2d30] bg-[#252526] px-2.5 py-1.5 text-[11px] text-[#858585]">
            <FileCode2 className="size-3.5 text-sky-400 shrink-0" />
            <span className="truncate">
              Active Context:{" "}
              <span className="text-sky-300 font-mono">{activeFile.name}</span>
            </span>
          </div>
        )}

        {/* Quick Suggestions */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6e7681]">
            Suggested Prompts
          </span>

          <div className="space-y-1.5">
            {suggestions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onPromptClick?.(item.prompt)}
                  className="w-full flex items-start gap-2.5 rounded-lg border border-[#2d2d30] bg-[#222226] p-2.5 text-left transition-all hover:border-purple-500/50 hover:bg-[#282830] group cursor-pointer"
                >
                  <Icon className="size-4 text-[#858585] group-hover:text-purple-400 shrink-0 mt-0.5 transition-colors" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[#cccccc] group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      <span className="rounded bg-purple-500/10 px-1.5 py-0.2 font-mono text-[9px] text-purple-300 border border-purple-500/20">
                        @bot
                      </span>
                    </div>
                    <p className="text-[11px] text-[#858585] line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Hints */}
      <div className="border-t border-[#2d2d30] pt-3 text-[10px] text-[#6e7681]">
        <span>Chat with team members directly, or mention </span>
        <code className="rounded bg-purple-500/15 px-1 py-0.5 font-mono text-purple-300 border border-purple-500/30">
          @bot
        </code>
        <span> to ask questions or trigger live code edits.</span>
      </div>
    </div>
  );
}
