"use client";

import { Bug, Code2, FileCode2, Sparkles, TestTube2, Wand2 } from "lucide-react";
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
      command: "/explain",
      label: "Explain this code",
      description: activeFile ? `Explain logic in ${activeFile.name}` : "Explain the current workspace code",
      icon: Code2,
      prompt: activeFile ? `/explain Explain the logic and purpose of ${activeFile.name}` : "Explain how this code works step by step",
    },
    {
      command: "/fix",
      label: "Find & fix bugs",
      description: "Analyze code for potential errors and fixes",
      icon: Bug,
      prompt: activeFile ? `/fix Review ${activeFile.name} and identify any potential bugs or edge cases` : "Find and fix potential bugs in this code",
    },
    {
      command: "/tests",
      label: "Generate unit tests",
      description: "Write comprehensive test cases",
      icon: TestTube2,
      prompt: activeFile ? `/tests Generate unit tests for ${activeFile.name}` : "Generate unit tests for this implementation",
    },
    {
      command: "/refactor",
      label: "Optimize & refactor",
      description: "Improve performance and readability",
      icon: Wand2,
      prompt: activeFile ? `/refactor Refactor ${activeFile.name} for better performance and clean code` : "Refactor this code for readability and performance",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between p-4 select-none">
      <div className="space-y-4">
        {/* Header Badge */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex size-8 items-center justify-center rounded-sm bg-[#007acc]/10 border border-[#007acc]/30 text-[#007acc]">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wide">
              CodeSync Copilot
            </h3>
            <p className="text-[11px] text-[#858585]">
              AI pair programmer for your workspace
            </p>
          </div>
        </div>

        {/* Active Context Banner */}
        {activeFile && (
          <div className="flex items-center gap-2 rounded-sm border border-[#2d2d30] bg-[#252526] px-2.5 py-1.5 text-[11px] text-[#858585]">
            <FileCode2 className="size-3.5 text-[#007acc] shrink-0" />
            <span className="truncate">
              Active Context:{" "}
              <span className="text-[#cccccc] font-mono">{activeFile.name}</span>
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
                  key={item.command}
                  type="button"
                  onClick={() => onPromptClick?.(item.prompt)}
                  className="w-full flex items-start gap-2.5 rounded-sm border border-[#2d2d30] bg-[#252526] p-2.5 text-left transition-colors hover:border-[#007acc] hover:bg-[#2a2d2e] group"
                >
                  <Icon className="size-4 text-[#858585] group-hover:text-[#007acc] shrink-0 mt-0.5 transition-colors" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[#cccccc] group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                      <span className="rounded bg-[#1e1e1e] px-1 py-0.2 font-mono text-[9px] text-[#007acc] border border-[#2d2d30]">
                        {item.command}
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
        <span>Tip: Type </span>
        <code className="rounded bg-[#252526] px-1 py-0.5 font-mono text-[#007acc] border border-[#2d2d30]">
          @bot
        </code>
        <span> or slash commands like </span>
        <code className="rounded bg-[#252526] px-1 py-0.5 font-mono text-[#007acc] border border-[#2d2d30]">
          /explain
        </code>
        <span> to begin.</span>
      </div>
    </div>
  );
}
