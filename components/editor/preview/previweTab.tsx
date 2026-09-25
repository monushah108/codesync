"use client";

import { useMemo, useState, useEffect } from "react";
import { BookOpen, Globe } from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { collectVirtualFileSystem } from "@/lib/features";
import SandpackPreview from "./sandpackPreview";
import MarkdownPreview from "./MarkdownPreview";

export default function PreviewTab({ parentId }: { parentId: string }) {
  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFiles = useCodestore((s) => s.openFiles);
  const code = useCodestore((s) => s.code);
  const cache = useExplorerstore((s) => s.cache);

  const activeFile = openFiles.find((f) => f._id === activeFileId);

  // Check if current active file is a markdown file
  const isCurrentFileMarkdown = useMemo(() => {
    if (!activeFile?.name) return false;
    const name = activeFile.name.toLowerCase();
    return (
      name.endsWith(".md") ||
      name.endsWith(".markdown") ||
      name.endsWith(".mdown") ||
      name.endsWith(".mkd")
    );
  }, [activeFile?.name]);

  // Check if virtual file system contains an HTML entrypoint for Sandpack
  const vfs = useMemo(() => {
    return collectVirtualFileSystem(cache, parentId, code);
  }, [cache, parentId, code]);

  const hasWebPreview = vfs.hasHtmlFile;

  // Active view mode: 'markdown' or 'web'
  const [activeMode, setActiveMode] = useState<"markdown" | "web">(() => {
    return isCurrentFileMarkdown ? "markdown" : hasWebPreview ? "web" : "markdown";
  });

  // Automatically update mode when user changes active file tab
  useEffect(() => {
    if (isCurrentFileMarkdown) {
      setActiveMode("markdown");
    } else if (hasWebPreview && activeFile?.name) {
      const isWebFile = /\.(html|jsx|tsx|vue|svelte|css|js|ts)$/i.test(
        activeFile.name,
      );
      if (isWebFile) {
        setActiveMode("web");
      }
    }
  }, [activeFileId, isCurrentFileMarkdown, hasWebPreview, activeFile?.name]);

  // Show switcher only if project has web preview capability
  const showSwitcher = hasWebPreview;

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
      {/* Segmented Switcher when both Markdown & Web Preview are possible */}
      {showSwitcher && (
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#202020] px-2 text-xs select-none">
          <div className="flex items-center gap-1 rounded bg-[#181818] p-0.5 border border-[#2d2d30]">
            <button
              type="button"
              onClick={() => setActiveMode("markdown")}
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${activeMode === "markdown"
                  ? "bg-[#007acc] text-white"
                  : "text-[#858585] hover:text-[#cccccc]"
                }`}
            >
              <BookOpen className="size-3" />
              <span>README / Markdown</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode("web")}
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${activeMode === "web"
                  ? "bg-[#007acc] text-white"
                  : "text-[#858585] hover:text-[#cccccc]"
                }`}
            >
              <Globe className="size-3" />
              <span>Web Sandbox</span>
            </button>
          </div>

          <span className="text-[10px] text-[#707070] uppercase">
            {activeMode === "markdown" ? "Live Markdown" : vfs.template}
          </span>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="min-h-0 flex-1 w-full overflow-hidden">
        {activeMode === "markdown" ? (
          <MarkdownPreview parentId={parentId} />
        ) : (
          <SandpackPreview parentId={parentId} />
        )}
      </div>
    </div>
  );
}

