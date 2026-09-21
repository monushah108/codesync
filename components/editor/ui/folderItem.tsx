"use client";

import { useState, memo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertCircle,
  ChevronRight,
  File as FileIcon,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useExplorerActions } from "@/lib/store/actions/useExplorerAction";
import useSocket from "@/context/socketProvider";
import { ExplorerFolder } from "@/lib/store/types/explorerTypes";
import ExplorerMenu from "../Module/ExplorerMenu";
import FileItem from "./fileItem";

type FolderProp = {
  item: ExplorerFolder;
  roomId: string;
  creating: {
    parentId: string | null | undefined;
    type: "file" | "folder" | null;
  };
  setCreating: (value: {
    parentId: string | null;
    type: "file" | "folder" | null;
  }) => void;
  setSelected: (id: string | null) => void;
  selected: string | null;
  depth?: number;
};

function FolderItem({
  item,
  roomId,
  creating,
  setCreating,
  setSelected,
  selected,
  depth = 0,
}: FolderProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.name);
  const [createInputValue, setCreateInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cache = useExplorerstore((s) => s.cache[item._id]);
  const { applyCreate, applyUpdate, applyRemove } = useSocket();

  const folders = cache?.folders || [];
  const files = cache?.files || [];
  const loading = cache?.loading;
  const isError = cache?.error;

  const indent = depth * 14 + 6;
  const isSelected = selected === item._id;

  /* ---------------- VALIDATE NAME ----------------- */
  const validateName = (
    val: string,
    type: "file" | "folder",
    currentId?: string,
  ) => {
    const name = val.trim().toLowerCase();

    if (!name) {
      setError("Name cannot be empty");
      return false;
    }

    if (name.includes(" ")) {
      setError(`${type === "file" ? "File" : "Folder"} name cannot contain spaces`);
      return false;
    }

    const fileExists = files.some(
      (f) => f._id !== currentId && f.name.trim().toLowerCase() === name,
    );
    const folderExists = folders.some(
      (f) => f._id !== currentId && f.name.trim().toLowerCase() === name,
    );

    if (type === "file" && fileExists) {
      setError("File already exists");
      return false;
    }

    if (type === "folder" && folderExists) {
      setError("Folder already exists");
      return false;
    }

    setError(null);
    return true;
  };

  /* ---------------- RENAME FOLDER ----------------- */
  const startRename = () => {
    setError(null);
    setRenameValue(item.name);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setError(null);
    setRenameValue(item.name);
    setIsRenaming(false);
  };

  const submitRename = async () => {
    if (!validateName(renameValue, "folder", item._id)) return;
    if (renameValue.trim() === item.name) {
      setIsRenaming(false);
      return;
    }

    if (!item.parentDirId) return;

    await useExplorerActions.renameFolder(
      roomId,
      item.parentDirId,
      item._id,
      renameValue.trim(),
    );
    applyUpdate(item.parentDirId, item._id, renameValue.trim(), "folder");
    setIsRenaming(false);
  };

  /* ---------------- DELETE FOLDER ----------------- */
  const handleDelete = async (id: string) => {
    if (item.parentDirId == null) return;
    await useExplorerActions.deleteFolder(roomId, item.parentDirId, id);
    applyRemove(item.parentDirId, id, "folder", item);
  };

  /* ---------------- CREATE ITEM ----------------- */
  const handleCreateSubmit = async () => {
    if (!createInputValue.trim() || error || !creating.type) return;

    if (!validateName(createInputValue, creating.type)) return;

    const trimmed = createInputValue.trim();
    if (creating.type === "file") {
      const file = await useExplorerActions.addFile(roomId, item._id, trimmed);
      if (file) applyCreate(item._id, file, "file");
    } else {
      const folder = await useExplorerActions.addFolder(roomId, item._id, trimmed);
      if (folder) applyCreate(item._id, folder, "folder");
    }

    setCreateInputValue("");
    setError(null);
    setCreating({ parentId: null, type: null });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={(open) => {
        if (open) useExplorerActions.loadFolder(roomId, item._id);
        setIsOpen(open);
      }}
    >
      {/* ================= FOLDER ROW ================= */}
      <ExplorerMenu
        id={item._id}
        name={item.name}
        Isparent={item.parentDirId != null}
        onRename={startRename}
        onDelete={() => handleDelete(item._id)}
      >
        <CollapsibleTrigger
          onClick={() => setSelected(item._id)}
          style={{ paddingLeft: `${indent}px` }}
          className={`group relative flex h-[27px] w-full cursor-pointer items-center gap-1.5 pr-2 text-[13px] select-none rounded-sm transition-colors duration-100 ${
            isSelected
              ? "bg-[#37373d]/90 text-white font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:rounded-r before:bg-amber-500"
              : "text-neutral-300 hover:bg-[#2a2d2e]/70 hover:text-neutral-100"
          }`}
        >
          <ChevronRight
            className={`size-3.5 shrink-0 text-neutral-400 transition-transform duration-150 ${
              isOpen ? "rotate-90 text-neutral-200" : ""
            }`}
          />

          {isOpen ? (
            <FolderOpen className="size-4 shrink-0 text-amber-400" />
          ) : (
            <Folder className="size-4 shrink-0 text-amber-400" />
          )}

          {isRenaming ? (
            <div className="relative flex min-w-0 flex-1 items-center">
              <input
                autoFocus
                value={renameValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setRenameValue(val);
                  validateName(val, "folder", item._id);
                }}
                onFocus={(e) => e.target.select()}
                onBlur={cancelRename}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter") submitRename();
                  if (e.key === "Escape") cancelRename();
                }}
                className="h-6 w-full max-w-[180px] rounded border border-sky-500/80 bg-[#18181b] px-1.5 py-0.5 text-xs text-white shadow-sm outline-none focus:ring-1 focus:ring-sky-400/50"
              />
              {error && (
                <div className="absolute left-0 top-full z-30 mt-1 flex items-center gap-1 whitespace-nowrap rounded border border-red-500/40 bg-[#2a1215] px-2 py-0.5 text-[11px] text-red-300 shadow-xl animate-in fade-in duration-100">
                  <AlertCircle className="size-3 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <span className="truncate text-left">{item.name}</span>
          )}
        </CollapsibleTrigger>
      </ExplorerMenu>

      {/* ================= FOLDER CONTENT ================= */}
      <CollapsibleContent>
        {loading && (
          <div
            style={{ paddingLeft: `${indent + 20}px` }}
            className="flex items-center gap-2 py-1 text-xs text-neutral-500"
          >
            <Spinner className="size-3 text-neutral-400" />
            <span className="text-[11px]">Loading...</span>
          </div>
        )}

        {isError && (
          <div
            style={{ marginLeft: `${indent + 20}px` }}
            className="my-1 flex items-center gap-1.5 rounded border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-400"
          >
            <AlertCircle className="size-3.5 shrink-0" />
            <span className="truncate">{isError}</span>
          </div>
        )}

        {/* --- SUBFOLDERS --- */}
        {folders.map((folder) => (
          <FolderItem
            key={folder._id}
            item={folder}
            roomId={roomId}
            creating={creating}
            setCreating={setCreating}
            setSelected={setSelected}
            selected={selected}
            depth={depth + 1}
          />
        ))}

        {/* --- FILES --- */}
        {files.map((file) => (
          <FileItem
            key={file._id}
            file={file}
            roomId={roomId}
            folderId={item._id}
            parentFolder={item}
            depth={depth}
            isSelected={selected === file._id}
            onSelect={setSelected}
            existingFiles={files}
          />
        ))}

        {/* --- INLINE CREATION INPUT --- */}
        {creating?.parentId === item._id && (
          <div
            style={{ paddingLeft: `${indent + 20}px` }}
            className="relative flex h-[27px] items-center gap-2 pr-2"
          >
            {creating.type === "file" ? (
              <FileIcon className="size-4 shrink-0 text-sky-400" />
            ) : (
              <Folder className="size-4 shrink-0 text-amber-400" />
            )}

            <div className="relative flex min-w-0 flex-1 items-center">
              <input
                autoFocus
                value={createInputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setCreateInputValue(val);
                  validateName(val, creating.type!);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSubmit();
                  if (e.key === "Escape") {
                    setError(null);
                    setCreating({ parentId: null, type: null });
                  }
                }}
                onBlur={() => {
                  setError(null);
                  setCreating({ parentId: null, type: null });
                }}
                placeholder={creating.type === "file" ? "file.ts" : "folder-name"}
                className="h-6 w-full max-w-[180px] rounded border border-sky-500/80 bg-[#18181b] px-1.5 py-0.5 text-xs text-white placeholder-neutral-500 shadow-sm outline-none focus:ring-1 focus:ring-sky-400/50"
              />

              {error && (
                <div className="absolute left-0 top-full z-30 mt-1 flex items-center gap-1 whitespace-nowrap rounded border border-red-500/40 bg-[#2a1215] px-2 py-0.5 text-[11px] text-red-300 shadow-xl animate-in fade-in duration-100">
                  <AlertCircle className="size-3 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default memo(FolderItem);
