"use client";

import { useMemo, useState, useEffect } from "react";
import { BookOpen, Globe } from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import {
  collectVirtualFileSystem,
  isReadmeFileName,
  isMdFileName,
  isHtmlFileName,
  isIndexHtmlFileName,
} from "@/lib/features";
import SandpackPreview from "./sandpackPreview";
import MarkdownPreview from "./MarkdownPreview";

export default function PreviewTab({ parentId }: { parentId: string }) {
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFileId = useCodestore((s) => s.activeFileId);
  const code = useCodestore((s) => s.code);
  const cache = useExplorerstore((s) => s.cache);

  const previewMode = useLayoutstore((s) => s.previewMode);
  const setPreviewMode = useLayoutstore((s) => s.setPreviewMode);

  // Check if virtual file system contains an HTML entrypoint (index.html) for Live Preview
  const vfs = useMemo(() => {
    return collectVirtualFileSystem(cache, parentId, code);
  }, [cache, parentId, code]);

  const hasWebPreview = vfs.hasHtmlFile;

  // Check if the workspace actually contains a file named README or markdown file
  const hasReadmeFile = useMemo(() => {
    if (openFiles.some((f) => isReadmeFileName(f.name) || isMdFileName(f.name))) return true;
    for (const p of Object.keys(vfs.files)) {
      const base = p.split("/").pop() ?? "";
      if (isReadmeFileName(base) || isMdFileName(base)) return true;
    }
    for (const folder of Object.values(cache)) {
      if (folder?.files?.some((f) => isReadmeFileName(f.name) || isMdFileName(f.name))) return true;
    }
    return false;
  }, [openFiles, vfs.files, cache]);

  // Active view mode: 'markdown' or 'web'
  // Like VS Code Live Preview: defaults to "web" if index.html is present in the workspace
  const [activeMode, setActiveMode] = useState<"markdown" | "web">(() => {
    if (previewMode === "markdown" && hasReadmeFile) return "markdown";
    if (previewMode === "web" && hasWebPreview) return "web";
    return hasWebPreview ? "web" : hasReadmeFile ? "markdown" : "web";
  });

  // Track active file in editor to intelligently switch preview mode
  const activeFile = useMemo(
    () => openFiles.find((f) => f._id === activeFileId),
    [openFiles, activeFileId]
  );

  useEffect(() => {
    if (!activeFile?.name) return;
    if (isReadmeFileName(activeFile.name) || isMdFileName(activeFile.name)) {
      setActiveMode("markdown");
      setPreviewMode("markdown");
    } else if (isIndexHtmlFileName(activeFile.name) || isHtmlFileName(activeFile.name)) {
      if (hasWebPreview) {
        setActiveMode("web");
        setPreviewMode("web");
      }
    }
  }, [activeFile?.name, hasWebPreview, setPreviewMode]);

  // Sync when user clicks specific preview buttons in the TabBar
  useEffect(() => {
    if (previewMode === "markdown" && hasReadmeFile) {
      setActiveMode("markdown");
    } else if (previewMode === "web" && hasWebPreview) {
      setActiveMode("web");
    }
  }, [previewMode, hasReadmeFile, hasWebPreview]);

  // If there are no readme files, automatically enforce "web" mode
  useEffect(() => {
    if (!hasReadmeFile && hasWebPreview) {
      setActiveMode("web");
    }
  }, [hasReadmeFile, hasWebPreview]);

  // Show switcher ONLY when BOTH index.html and a README file exist in the workspace
  const showSwitcher = hasWebPreview && hasReadmeFile;

  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
      {/* Switcher bar: only visible when both website live preview and readme exist */}
      {showSwitcher && (
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#202020] px-2 text-xs select-none">
          <div className="flex items-center gap-1 rounded bg-[#181818] p-0.5 border border-[#2d2d30]">
            <button
              type="button"
              onClick={() => {
                setActiveMode("web");
                setPreviewMode("web");
              }}
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                activeMode === "web"
                  ? "bg-[#007acc] text-white"
                  : "text-[#858585] hover:text-[#cccccc]"
              }`}
            >
              <Globe className="size-3" />
              <span>Live Preview</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode("markdown");
                setPreviewMode("markdown");
              }}
              className={`flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                activeMode === "markdown"
                  ? "bg-[#007acc] text-white"
                  : "text-[#858585] hover:text-[#cccccc]"
              }`}
            >
              <BookOpen className="size-3" />
              <span>README</span>
            </button>
          </div>

          <span className="text-[10px] text-[#707070] uppercase">
            {activeMode === "markdown" ? "README Preview" : vfs.template}
          </span>
        </div>
      )}

      {/* Main Preview Container */}
      <div className="min-h-0 min-w-0 max-w-full flex-1 w-full overflow-hidden">
        {hasWebPreview ? (
          activeMode === "markdown" && hasReadmeFile ? (
            <MarkdownPreview parentId={parentId} />
          ) : (
            <SandpackPreview parentId={parentId} />
          )
        ) : hasReadmeFile ? (
          <MarkdownPreview parentId={parentId} />
        ) : (
          <div className="flex h-full w-full min-h-0 flex-col items-center justify-center p-6 text-center select-none bg-[#181818]">
            <div className="flex size-12 items-center justify-center rounded-full border border-[#333333] bg-[#252526] mb-4">
              <Globe className="size-6 text-[#858585]" />
            </div>
            <h3 className="text-sm font-medium text-[#cccccc] mb-1">Live Preview</h3>
            <p className="text-xs text-[#858585] max-w-xs leading-relaxed">
              No <code className="px-1.5 py-0.5 rounded bg-[#252526] text-[#3794ff]">index.html</code> found in the workspace.
              Create an <code className="px-1.5 py-0.5 rounded bg-[#252526] text-[#3794ff]">index.html</code> file to preview your website live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

