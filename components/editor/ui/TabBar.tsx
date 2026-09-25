"use client";

import { memo } from "react";
import { Download, Eye, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCodestore } from "@/lib/store/Codestore";
import SaveFile from "../Module/saveFile";

import { useLayoutstore } from "@/lib/store/Layoutstore";
import { useCodeActions } from "@/lib/store/actions/useCodeAction";

import { Icon } from "@iconify/react";
import { getFileIcon } from "@/lib/features";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadFile } from "@/lib/api/explorerApi";
import { toast } from "sonner";

const TabBar = memo(function TabBar({ roomId }: { roomId: string }) {
  /* --------------------------------------------------
     CODE STORE
  -------------------------------------------------- */

  const openFiles = useCodestore((s) => s.openFiles);

  const activeFileId = useCodestore((s) => s.activeFileId || "");

  const closeFile = useCodestore((s) => s.closeFile);
  const openFile = useCodestore((s) => s.openFile);
  const setEdited = useCodestore((s) => s.setFileEdited);
  const setActiveFile = useCodestore((s) => s.setActiveFile);

  const running = useCodestore((s) => s.code[activeFileId]?.running);

  /* --------------------------------------------------
     LAYOUT STORE
  -------------------------------------------------- */

  const isPreviewOpen = useLayoutstore((s) => s.panels.preview);
  const togglePanel = useLayoutstore((s) => s.togglePanel);
  const openPanel = useLayoutstore((s) => s.openPanel);

  /* --------------------------------------------------
     GUARD
  -------------------------------------------------- */

  if (!activeFileId) {
    return null;
  }

  /* --------------------------------------------------
     ACTIVE FILE
  -------------------------------------------------- */

  const activeFile = openFiles.find((file) => file._id === activeFileId);

  /* --------------------------------------------------
     NEXT FILE
  -------------------------------------------------- */

  const nextFile = openFiles.find((file) => file._id !== activeFileId);

  /* --------------------------------------------------
     DOWNLOAD FILE
  -------------------------------------------------- */

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    const toastId = toast.loading(`Preparing ${fileName}...`);
    try {
      await downloadFile(roomId, fileId, fileName);
      toast.success(`Downloaded ${fileName}!`, { id: toastId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download file";
      toast.error(message, { id: toastId });
    }
  };

  const handleDownloadActiveFile = async () => {
    if (!activeFile) return;
    await handleDownloadFile(activeFile._id, activeFile.name);
  };

  const handleCloseOthers = (keepId: string) => {
    openFiles.forEach((file) => {
      if (file._id !== keepId) {
        closeFile(file._id);
      }
    });
  };

  const handleCloseAll = () => {
    openFiles.forEach((file) => {
      closeFile(file._id);
    });
  };

  /* --------------------------------------------------
     PREVIEW
  -------------------------------------------------- */

  const handlePreview = () => {
    if (!running && !isPreviewOpen) {
      useCodeActions.runCode(activeFileId);
    }

    togglePanel("preview");
  };

  /* --------------------------------------------------
     RUN CODE
  -------------------------------------------------- */

  const handleRunCode = async () => {
    if (running || !activeFileId) {
      return;
    }

    // Expand terminal panel in current window without navigating away
    openPanel("terminal");

    await useCodeActions.runCode(activeFileId);
  };

  return (
    <div className="flex h-9 min-w-0 shrink-0 items-center border-b border-[#2d2d30] bg-[#252526]">
      {/* =================================================
          FILE TABS
      ================================================= */}

      <ScrollArea className="min-w-0 flex-1 h-full">
        <div className="flex h-9 w-max min-w-full items-stretch">
          {openFiles.map((file) => {
            const isActive = file._id === activeFileId;

            return (
              <ContextMenu key={file._id}>
                <ContextMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="none"
                    title={file.name}
                    onClick={() => openFile(file, roomId)}
                    className={`
                      group relative flex h-9 min-w-24 sm:min-w-30 max-w-52
                      shrink-0 items-center gap-1.5 sm:gap-2
                      rounded-none border-r border-[#2d2d30]
                      px-2.5 sm:px-3 text-xs font-normal
                      transition-colors

                      ${isActive
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
                          flex size-5 shrink-0
                          items-center justify-center
                          rounded-sm
                          opacity-0
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
                </ContextMenuTrigger>

                <ContextMenuContent
                  onCloseAutoFocus={(e) => {
                    e.preventDefault();
                  }}
                  className="
                    w-44
                    rounded-md
                    border border-[#454545]
                    bg-[#252526]
                    p-1
                    text-[#cccccc]
                    shadow-xl
                  "
                >
                  <ContextMenuItem
                    onSelect={() => handleDownloadFile(file._id, file.name)}
                    className="
                      flex items-center gap-2
                      rounded-sm
                      px-2.5 py-1.5
                      text-sm
                      outline-none
                      cursor-pointer
                      focus:bg-[#37373d]
                      focus:text-white
                    "
                  >
                    <Download className="size-3.5 text-blue-400" />
                    <span>Download File</span>
                  </ContextMenuItem>

                  <ContextMenuSeparator className="my-1 bg-[#3c3c3c]" />

                  <ContextMenuItem
                    onSelect={() => closeFile(file._id)}
                    className="
                      flex items-center gap-2
                      rounded-sm
                      px-2.5 py-1.5
                      text-sm
                      outline-none
                      cursor-pointer
                      focus:bg-[#37373d]
                      focus:text-white
                    "
                  >
                    <X className="size-3.5" />
                    <span>Close</span>
                  </ContextMenuItem>

                  <ContextMenuItem
                    onSelect={() => handleCloseOthers(file._id)}
                    className="
                      flex items-center gap-2
                      rounded-sm
                      px-2.5 py-1.5
                      text-sm
                      outline-none
                      cursor-pointer
                      focus:bg-[#37373d]
                      focus:text-white
                    "
                  >
                    <span>Close Others</span>
                  </ContextMenuItem>

                  <ContextMenuItem
                    onSelect={handleCloseAll}
                    className="
                      flex items-center gap-2
                      rounded-sm
                      px-2.5 py-1.5
                      text-sm
                      outline-none
                      cursor-pointer
                      focus:bg-[#37373d]
                      focus:text-white
                    "
                  >
                    <span>Close All</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>

        <ScrollBar
          orientation="horizontal"
          className="
            h-1.5
            border-none
            border-[#2d2d30]
            bg-[#252526]
          "
        />
      </ScrollArea>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div
        className="
          flex h-full shrink-0
          items-center gap-1
          border-l border-[#2d2d30]
          bg-[#252526]
          px-1.5
        "
      >
        {/* Download File */}

        {activeFile && (
          <Button
            type="button"
            variant="none"
            onClick={handleDownloadActiveFile}
            title={`Download ${activeFile.name}`}
            className="
              h-7 gap-1 sm:gap-1.5
              rounded-sm
              px-2 sm:px-2.5
              text-xs
              text-[#cccccc]
              hover:bg-[#2d2d30]
              hover:text-white
            "
          >
            <Download className="size-3.5 text-blue-400" />

            <span className="hidden md:inline">Download</span>
          </Button>
        )}

        {/* Preview */}

        <Button
          type="button"
          variant="none"
          onClick={handlePreview}
          title={isPreviewOpen ? "Hide Preview" : "Open Preview"}
          className={`
            h-7 gap-1 sm:gap-1.5
            rounded-sm
            px-2 sm:px-2.5
            text-xs
            hover:bg-[#2d2d30]
            hover:text-white

            ${isPreviewOpen ? "bg-[#3a3a3d] text-[#3794ff]" : "text-[#cccccc]"}
          `}
        >
          <Eye className="size-3.5" />

          <span className="hidden sm:inline">Preview</span>
        </Button>

        {/* Run Code */}

        <Button
          type="button"
          variant="none"
          disabled={running}
          onClick={handleRunCode}
          title={running ? "Running" : "Run Code"}
          className="
            h-7 gap-1 sm:gap-1.5
            rounded-sm
            bg-[#007acc]
            px-2 sm:px-2.5
            text-xs
            text-white
            hover:bg-[#006bb3]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {running ? (
            <span className="animate-spin text-xs">◌</span>
          ) : (
            <Play className="size-3 fill-current" />
          )}

          <span>{running ? "Running..." : "Run"}</span>
        </Button>
      </div>
    </div>
  );
});

export default TabBar;
