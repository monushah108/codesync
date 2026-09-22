"use client";

import { useState, memo } from "react";
import { Icon } from "@iconify/react";
import { AlertCircle } from "lucide-react";
import { getFileIcon } from "@/lib/features";
import { ExplorerFile, ExplorerFolder } from "@/lib/store/types/explorerTypes";
import { useCodestore } from "@/lib/store/Codestore";
import { useExplorerActions } from "@/lib/store/actions/useExplorerAction";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import useSocket from "@/context/socketProvider";
import ExplorerMenu from "../Module/ExplorerMenu";

interface FileItemProps {
  file: ExplorerFile;
  roomId: string;
  folderId: string;
  parentFolder: ExplorerFolder;
  depth: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  existingFiles: ExplorerFile[];
}

function FileItem({
  file,
  roomId,
  folderId,
  parentFolder,
  depth,
  isSelected,
  onSelect,
  existingFiles,
}: FileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const [error, setError] = useState<string | null>(null);

  const openFile = useCodestore((s) => s.openFile);
  const { applyUpdate, applyRemove } = useSocket();

  const indent = depth * 14 + 18;

  /* ---------------- VALIDATE NAME ----------------- */
  const validateName = (val: string) => {
    const name = val.trim().toLowerCase();

    if (!name) {
      setError("Name cannot be empty");
      return false;
    }

    if (name.includes(" ")) {
      setError("File name cannot contain spaces");
      return false;
    }

    const fileExists = existingFiles.some(
      (f) => f._id !== file._id && f.name.trim().toLowerCase() === name,
    );

    if (fileExists) {
      setError("File already exists");
      return false;
    }

    setError(null);
    return true;
  };

  /* ---------------- RENAME ACTIONS ----------------- */
  const startRename = (id: string, name: string) => {
    setError(null);
    setRenameValue(name);
    setIsRenaming(true);
  };

  const cancelRename = () => {
    setError(null);
    setRenameValue(file.name);
    setIsRenaming(false);
  };

  const submitRename = async () => {
    if (!validateName(renameValue)) return;
    if (renameValue.trim() === file.name) {
      setIsRenaming(false);
      return;
    }

    await useExplorerActions.renameFile(
      roomId,
      folderId,
      file._id,
      renameValue.trim(),
    );
    applyUpdate(folderId, file._id, renameValue.trim(), "file");
    setIsRenaming(false);
  };

  /* ---------------- DELETE ACTION ----------------- */
  const handleDelete = async (id: string) => {
    await useExplorerActions.deleteFile(roomId, folderId, id);
    applyRemove(folderId, id, "file", parentFolder);
  };

  const handleOpenFile = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onSelect(file._id);
    openFile(file, roomId);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      useLayoutstore.getState().closePanel("explorer");
    }
  };

  return (
    <ExplorerMenu
      id={file._id}
      name={file.name}
      Isparent={true}
      onRename={startRename}
      onDelete={handleDelete}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpenFile}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleOpenFile(e);
          }
        }}
        style={{ paddingLeft: `${indent}px` }}
        className={`group relative flex h-[27px] w-full cursor-pointer items-center gap-2 pr-2 text-[13px] select-none transition-colors duration-100 ${
          isSelected
            ? "bg-[#37373d]/90 text-white font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:rounded-r before:bg-sky-500"
            : "text-neutral-300 hover:bg-[#2a2d2e]/70 hover:text-neutral-100"
        }`}
      >
        <Icon
          icon={getFileIcon(file.name)}
          width={15}
          height={15}
          className="shrink-0"
        />

        {isRenaming ? (
          <div className="relative flex min-w-0 flex-1 items-center">
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => {
                const val = e.target.value;
                setRenameValue(val);
                validateName(val);
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
          <span className="truncate text-left">{file.name}</span>
        )}

        {file.isEdited && (
          <span
            title="Unsaved changes"
            className="ml-auto size-1.5 shrink-0 rounded-full bg-amber-400"
          />
        )}
      </div>
    </ExplorerMenu>
  );
}

export default memo(FileItem);
