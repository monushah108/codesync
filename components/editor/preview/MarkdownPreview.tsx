"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodestore } from "@/lib/store/Codestore";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import MdMsg from "../ui/mdMsg";

interface MarkdownPreviewProps {
  parentId?: string;
}

export default function MarkdownPreview({ parentId }: MarkdownPreviewProps) {
  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const code = useCodestore((s) => s.code);
  const closePanel = useLayoutstore((s) => s.closePanel);

  const activeFile = openFiles.find((f) => f._id === activeFileId);

  // Target current active file if markdown, or fallback to any open markdown file
  const targetFile = useMemo(() => {
    if (activeFile?.name?.toLowerCase().endsWith(".md")) {
      return activeFile;
    }
    return (
      openFiles.find((f) => f.name?.toLowerCase().endsWith(".md")) || activeFile
    );
  }, [activeFile, openFiles]);

  const content = targetFile
    ? (code[targetFile._id]?.content ?? targetFile.content ?? "")
    : "";

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
      {/* Top Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 text-xs select-none">
        <div className="flex items-center gap-2 min-w-0">
          <Icon
            icon="vscode-icons:file-type-markdown"
            width={15}
            height={15}
            className="shrink-0"
          />
          <span className="font-medium text-[#cccccc] truncate">
            {targetFile?.name || "README.md"}
          </span>
          <span className="rounded bg-[#1e1e1e] border border-[#333333] px-1.5 py-0.2 text-[10px] text-[#858585]">
            Preview
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          title="Close Preview"
          className="size-7 rounded-sm text-[#858585] hover:bg-[#333333] hover:text-white"
          onClick={() => closePanel("preview")}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Render Markdown using MdMsg (third-party react-markdown + remark-gfm from AI Chat) */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-[#1e1e1e] p-4 sm:p-6 select-text">
        {content.trim() ? (
          <div className="max-w-3xl mx-auto">
            <MdMsg content={content} />
          </div>
        ) : (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center text-[#858585] select-none">
            <BookOpen className="size-8 text-[#555555] mb-2" />
            <p className="text-xs">
              {targetFile?.name || "Markdown file"} is empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
