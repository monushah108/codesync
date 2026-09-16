"use client";
import { memo } from "react";
import { Eye, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCodestore } from "@/lib/store/Codestore";
import SaveFile from "../Module/saveFile";
import { useLayout } from "@/context/layout-context";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";
import { Icon } from "@iconify/react";
import { getFileIcon } from "@/lib/features";

const TabBar = memo(function TabBar({ roomId }: { roomId: string }) {
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFileId = useCodestore((s) => s.activeFileId || "");

  const closeFile = useCodestore((s) => s.closeFile);
  const openFile = useCodestore((s) => s.openFile);
  const setEdited = useCodestore((s) => s.setFileEdited);
  const setActiveFile = useCodestore((s) => s.setActiveFile);

  const running = useCodestore((s) => s.code[activeFileId]?.running);

  const { open } = useLayout();

  if (!activeFileId) return null;

  const activeFile = openFiles.find((file) => file._id === activeFileId);

  const nextFile = openFiles.find((file) => file._id !== activeFileId);

  const handlePreview = () => {
    if (!running) {
      useCodeActions.runCode(activeFileId);
    }

    open("previewTab");
  };

  const handleRunCode = () => {
    if (running) return;

    useCodeActions.runCode(activeFileId);
    open("terminal");
  };

  return (
    <div className="flex h-9 shrink-0 items-center border-b border-[#2d2d30] bg-[#252526]">
      {/* Tabs */}
      <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto scrollbar-none">
        {openFiles.map((file) => {
          const isActive = file._id === activeFileId;

          return (
            <Button
              key={file._id}
              type="button"
              variant="none"
              title={file.name}
              onClick={() => openFile(file, roomId)}
              className={`
                group relative flex h-9 min-w-30 max-w-52
                shrink-0 items-center gap-2
                rounded-none border-r border-[#2d2d30]
                px-3 text-xs font-normal
                transition-colors
                ${
                  isActive
                    ? "bg-[#1e1e1e] text-[#d4d4d4]"
                    : "bg-[#252526] text-[#858585] hover:bg-[#2d2d30] hover:text-[#cccccc]"
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-[#007acc]" />
              )}

              {/* File Icon */}
              <Icon
                icon={getFileIcon(file.name)}
                width={15}
                height={15}
                className="shrink-0"
              />

              {/* File Name */}
              <span className="min-w-0 flex-1 truncate text-left">
                {file.name}
              </span>

              {/* Edited / Close */}
              {file.isEdited ? (
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="flex shrink-0 items-center"
                >
                  <SaveFile
                    onDiscard={() => {
                      setActiveFile(nextFile?._id ?? null);
                    }}
                    onSave={() => {
                      setEdited(file._id, false);
                    }}
                  />
                </span>
              ) : (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Close ${file.name}`}
                  className="
                    flex size-5 shrink-0 items-center justify-center
                    rounded-sm opacity-0
                    transition-all
                    hover:bg-[#454545]
                    group-hover:opacity-100
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file._id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      closeFile(file._id);
                    }
                  }}
                >
                  <X className="size-3.5" />
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex h-full shrink-0 items-center gap-1 border-l border-[#2d2d30] px-1.5">
        {/* Preview */}
        <Button
          type="button"
          variant="none"
          onClick={handlePreview}
          title="Open Preview"
          className="
            h-7 gap-1.5 rounded-sm
            px-2.5
            text-xs text-[#cccccc]
            hover:bg-[#2d2d30]
            hover:text-white
          "
        >
          <Eye className="size-3.5" />
          <span>Preview</span>
        </Button>

        {/* Run Code */}
        <Button
          type="button"
          variant="none"
          disabled={running}
          onClick={handleRunCode}
          title={running ? "Code is running" : "Run Code"}
          className="
            h-7 gap-1.5 rounded-sm
            bg-[#007acc]
            px-2.5
            text-xs text-white
            hover:bg-[#006bb3]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Play className="size-3 fill-current" />
          <span>{running ? "Running..." : "Run Code"}</span>
        </Button>
      </div>
    </div>
  );
});

export default TabBar;
