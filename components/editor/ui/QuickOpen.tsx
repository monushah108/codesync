"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileCode2, Search, X, CornerDownLeft, Sparkles, Folder } from "lucide-react";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import { getFileIcon } from "@/lib/features";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useCodestore } from "@/lib/store/Codestore";
import { ExplorerFile } from "@/lib/store/types/explorerTypes";
import { fetchAllFiles } from "@/lib/api/codeApi";

interface QuickOpenProps {
  roomId?: string;
}

export default function QuickOpen({ roomId: propRoomId }: QuickOpenProps) {
  const params = useParams();
  const roomId = propRoomId || (params?.roomId as string);

  const isQuickOpen = useLayoutstore((s) => s.isQuickOpen);
  const quickOpenMode = useLayoutstore((s) => s.quickOpenMode);
  const closeQuickOpen = useLayoutstore((s) => s.closeQuickOpen);
  const setPendingEditorAction = useLayoutstore((s) => s.setPendingEditorAction);

  const cache = useExplorerstore((s) => s.cache);
  const openFiles = useCodestore((s) => s.openFiles);
  const activeFileId = useCodestore((s) => s.activeFileId);
  const openFile = useCodestore((s) => s.openFile);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remoteFiles, setRemoteFiles] = useState<ExplorerFile[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isQuickOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isQuickOpen]);

  // Fetch all files from backend on mount or when quick open is opened
  useEffect(() => {
    if (!isQuickOpen || !roomId) return;

    let isMounted = true;
    setLoading(true);

    fetchAllFiles<ExplorerFile[]>(roomId)
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setRemoteFiles(data);
        }
      })
      .catch((err) => {
        console.warn("Quick open files fetch fallback:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isQuickOpen, roomId]);

  // Build folder lookup map (folderId -> folderName)
  const folderNames = useMemo(() => {
    const map = new Map<string, string>();
    Object.values(cache).forEach((folderCache) => {
      if (folderCache.rootFolder?._id) {
        map.set(folderCache.rootFolder._id, folderCache.rootFolder.name || "root");
      }
      folderCache.folders?.forEach((folder) => {
        if (folder._id && folder.name) {
          map.set(folder._id, folder.name);
        }
      });
    });
    return map;
  }, [cache]);

  // Combine and deduplicate files from cache, openFiles, and remote API
  const allFiles = useMemo(() => {
    const map = new Map<string, ExplorerFile>();

    // 1. From local explorer cache (loaded folders)
    Object.values(cache).forEach((folderCache) => {
      folderCache.files?.forEach((file) => {
        if (file?._id) {
          map.set(file._id, file);
        }
      });
    });

    // 2. From currently open tabs
    openFiles.forEach((file) => {
      if (file?._id && !map.has(file._id)) {
        map.set(file._id, {
          _id: file._id,
          name: file.name,
          parentId: file.parentId,
          content: file.content || "",
          isEdited: file.isEdited || false,
          type: "file",
        });
      }
    });

    // 3. From backend API
    remoteFiles.forEach((file) => {
      if (file?._id && !map.has(file._id)) {
        map.set(file._id, {
          ...file,
          type: "file",
        });
      }
    });

    return Array.from(map.values());
  }, [cache, openFiles, remoteFiles]);

  // Filter files by query
  const filteredFiles = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Prioritize active file, then open files, then rest
      return [...allFiles].sort((a, b) => {
        if (a._id === activeFileId) return -1;
        if (b._id === activeFileId) return 1;
        const aOpen = openFiles.some((f) => f._id === a._id);
        const bOpen = openFiles.some((f) => f._id === b._id);
        if (aOpen && !bOpen) return -1;
        if (!aOpen && bOpen) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    return allFiles.filter((f) => {
      const fileNameMatch = f.name.toLowerCase().includes(trimmed);
      const folderName = (f.parentId && folderNames.get(f.parentId)) || "";
      const folderMatch = folderName.toLowerCase().includes(trimmed);
      return fileNameMatch || folderMatch;
    });
  }, [allFiles, query, activeFileId, openFiles, folderNames]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Ensure selected item stays in view
  useEffect(() => {
    const item = itemRefs.current[selectedIndex];
    if (item && listRef.current) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Select/Open a file
  const handleSelectFile = useCallback(
    async (file: ExplorerFile) => {
      closeQuickOpen();

      if (quickOpenMode === "find") {
        setPendingEditorAction("find");
      }

      if (roomId) {
        await openFile(file, roomId);
      }
    },
    [closeQuickOpen, quickOpenMode, setPendingEditorAction, roomId, openFile],
  );

  // Keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeQuickOpen();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredFiles.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredFiles.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredFiles.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredFiles.length) % filteredFiles.length);
      }
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredFiles[selectedIndex];
      if (selected) {
        handleSelectFile(selected);
      }
    }
  };

  if (!isQuickOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[12vh] bg-black/60 backdrop-blur-[2px] select-none">
        {/* Backdrop click dismiss */}
        <div className="absolute inset-0" onClick={closeQuickOpen} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl mx-4 flex flex-col rounded-lg bg-[#252526] border border-[#3c3c3c] shadow-2xl shadow-black/80 overflow-hidden text-[#cccccc]"
          onKeyDown={handleKeyDown}
        >
          {/* Header & Search Bar */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#2d2d30] bg-[#1e1e1e]">
            <Search className="w-4 h-4 text-[#007acc] shrink-0" />

            {quickOpenMode === "find" && (
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#007acc]/20 text-[#007acc] border border-[#007acc]/40">
                Find in File
              </span>
            )}

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                quickOpenMode === "find"
                  ? "Select a file to search within..."
                  : "Search files by name (e.g. App.tsx, styles.css)..."
              }
              className="flex-1 bg-transparent text-sm text-[#cccccc] placeholder:text-[#858585] focus:outline-none font-sans"
              autoComplete="off"
              spellCheck={false}
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded text-[#858585] hover:text-[#cccccc] hover:bg-[#2d2d2d] transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] font-mono text-[#858585]">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-72 min-h-[4rem] overflow-y-auto overflow-x-hidden py-1 divide-y divide-[#2a2a2a]/40"
          >
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, idx) => {
                const isSelected = idx === selectedIndex;
                const isActive = file._id === activeFileId;
                const folderName =
                  (file.parentId && folderNames.get(file.parentId)) || "";

                return (
                  <button
                    key={file._id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleSelectFile(file)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer border-l-2 ${
                      isSelected
                        ? "bg-[#04395e] text-white border-[#007acc]"
                        : "text-[#cccccc] hover:bg-[#2a2d2e] border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                      {/* File Icon */}
                      <Icon
                        icon={getFileIcon(file.name)}
                        className="w-4 h-4 shrink-0"
                      />

                      {/* File Name */}
                      <span
                        className={`truncate font-medium ${
                          isSelected ? "text-white" : "text-[#cccccc]"
                        }`}
                      >
                        {file.name}
                      </span>

                      {/* Parent Folder Hint */}
                      {folderName && (
                        <span className="text-[11px] text-[#858585] truncate flex items-center gap-1">
                          <Folder className="w-3 h-3 text-[#6a6a6a] shrink-0" />
                          <span>{folderName}</span>
                        </span>
                      )}
                    </div>

                    {/* Right Meta Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[#007acc]/20 text-[#007acc] border border-[#007acc]/30">
                          active
                        </span>
                      )}

                      {isSelected && (
                        <span className="text-[10px] text-[#858585] flex items-center gap-0.5">
                          <CornerDownLeft className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#858585]">
                <div className="size-3.5 border-2 border-[#007acc] border-t-transparent rounded-full animate-spin" />
                <span>Scanning workspace files...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <FileCode2 className="w-7 h-7 text-[#5a5a5a] mb-2" strokeWidth={1.5} />
                <p className="text-xs text-[#cccccc] font-medium">
                  {query ? "No matching files found" : "No files in workspace"}
                </p>
                <p className="text-[11px] text-[#858585] mt-1">
                  {query
                    ? "Try a different search query."
                    : "Create a new file from the explorer sidebar to get started."}
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e1e] border-t border-[#2d2d30] text-[10px] text-[#858585]">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1 py-0.5 rounded bg-[#2a2a2a] text-[#cccccc] font-mono">↑</kbd>{" "}
                <kbd className="px-1 py-0.5 rounded bg-[#2a2a2a] text-[#cccccc] font-mono">↓</kbd> navigate
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-[#2a2a2a] text-[#cccccc] font-mono">↵</kbd> {quickOpenMode === "find" ? "find in file" : "open file"}
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-[#2a2a2a] text-[#cccccc] font-mono">esc</kbd> close
              </span>
            </div>

            <span className="text-[10px] text-[#707070]">
              {filteredFiles.length} {filteredFiles.length === 1 ? "file" : "files"}
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
