"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { PanelImperativeHandle } from "react-resizable-panels";

import { ResizablePanel } from "../ui/resizable";
import { useLayout } from "@/context/layout-context";

import { useExplorerstore } from "@/lib/store/Explorerstore";
import { useExplorerActions } from "@/lib/store/actions/useExplorerAction";

import { FileHeader } from "./ui/fileHeader";
import FolderItem from "./ui/folderItem";
import NoFolder from "./ui/noFolder";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { Spinner } from "../ui/spinner";

type CreateState = {
  parentId: string | null;
  type: "file" | "folder" | null;
};

function FileExplore({
  roomId,
  parentId,
}: {
  roomId: string;
  parentId: string;
}) {
  const exRef = useRef<PanelImperativeHandle>(null);

  const { panels } = useLayout();

  const [selected, setSelected] = useState<string | null>(null);

  const [creating, setCreating] = useState<CreateState>({
    parentId: null,
    type: null,
  });

  const [ReFetching, setReFetching] = useTransition();
  const [DataRetrivelChances, setDataRetrivel] = useState(5);
  const data = useExplorerstore((state) => state.cache[parentId]);

  const root = data?.rootFolder;
  const loading = data?.loading ?? false;
  const error = data?.error;

  /* ---------------- LOAD ROOT ---------------- */

  useEffect(() => {
    if (!roomId || !parentId) return;

    useExplorerActions.loadFolder(roomId, parentId);
  }, [roomId, parentId]);

  /* ---------------- CREATE ---------------- */

  const handleCreate = useCallback(
    (type: "file" | "folder") => {
      const targetParent = selected ?? root?._id;

      if (!targetParent) return;

      setCreating({
        parentId: targetParent,
        type,
      });
    },
    [selected, root?._id],
  );

  const handleCreateFile = useCallback(() => {
    handleCreate("file");
  }, [handleCreate]);

  const handleCreateFolder = useCallback(() => {
    handleCreate("folder");
  }, [handleCreate]);

  /* ---------------- RETRY ---------------- */

  const handleLoadFileRetry = () => {
    if (DataRetrivelChances <= 0) return;

    setReFetching(() => {
      useExplorerActions.loadFolder(roomId, parentId);
    });

    setDataRetrivel((prev) => {
      const next = prev - 1;

      if (next === 0) {
        setTimeout(() => {
          setDataRetrivel(5);
        }, 10000);
      }

      return next;
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <ResizablePanel
      panelRef={exRef}
      collapsible
      collapsedSize={0}
      defaultSize={panels.explorer ? 20 : 0}
      minSize={15}
    >
      <div className="flex h-full min-h-0 flex-col border-r border-[#2d2d30] bg-[#1e1e1e] text-gray-300">
        {/* Loading */}
        {loading && !root ? (
          <FileExploreSkeleton />
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-sm text-red-400">Failed to load explorer</p>

            <p className="max-w-60 text-xs text-gray-500">{error}</p>

            {DataRetrivelChances > 0 ? (
              <button
                disabled={ReFetching}
                type="button"
                onClick={handleLoadFileRetry}
                className="mt-2 rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-[#2d2d30] hover:text-white"
              >
                {ReFetching && <Spinner />}
                Retry
              </button>
            ) : (
              <p className="max-w-60 text-xs text-gray-500">
                Please wait 10 seconds before retrying again.
              </p>
            )}
          </div>
        ) : !root ? (
          <NoFolder />
        ) : (
          <>
            <FileHeader
              handleCreateFile={handleCreateFile}
              handleCreateFolder={handleCreateFolder}
            />

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <FolderItem
                item={root}
                roomId={roomId}
                creating={creating}
                setCreating={setCreating}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </>
        )}
      </div>
    </ResizablePanel>
  );
}

export default FileExplore;
