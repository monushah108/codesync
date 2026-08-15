"use client";

import { Suspense, useEffect, useRef, useState } from "react";

import { ResizablePanel } from "../ui/resizable";
import FileExploreSkeleton from "./Skeleton/FileExploreSkeleton";
import { PanelImperativeHandle } from "react-resizable-panels";
import { useLayout } from "@/context/layout-context";
import { FileHeader } from "./ui/fileHeader";

import FolderItem from "./ui/folderItem";
import NoFolder from "./ui/noFolder";

import { useExplorerActions } from "@/lib/store/actions/useExplorerAction";
import ShowAlert from "./ui/showAlert";
import { ExplorerFolder } from "@/lib/store/types/explorerTypes";

function FileExplore({ roomId }: { roomId: string }) {
  const exRef = useRef<PanelImperativeHandle>(null);
  const { panels } = useLayout();

  const [selected, setSelected] = useState<string | null>(null);

  const [creating, setCreating] = useState<{
    parentId: string | null | undefined;
    type: "file" | "folder" | null;
  }>({
    parentId: null,
    type: null,
  });

  const [root, setRoot] = useState<ExplorerFolder | null>(null);

  const [alert, setAlert] = useState({
    open: false,
    reason: "",
    desc: "",
  });

  useEffect(() => {
    async function getFolder() {
      const res = await useExplorerActions.loadFolder(roomId);

      setRoot(res?.rootFolder ?? null);

      if (!res?.rootFolder) {
        setAlert({
          open: true,
          reason: "Unable to load files",
          desc: "Something went wrong while loading the file explorer.",
        });
      }
    }

    getFolder();
  }, [roomId]);

  const handleCreateFile = () => {
    const parent = selected || root?._id;

    setCreating({
      parentId: parent,
      type: "file",
    });
  };

  const handleCreateFolder = () => {
    const parent = selected || root?._id;

    setCreating({
      parentId: parent,
      type: "folder",
    });
  };

  return (
    <>
      <ResizablePanel
        panelRef={exRef}
        collapsible
        collapsedSize={0}
        defaultSize={panels.explorer ? 20 : 0}
      >
        <Suspense fallback={<FileExploreSkeleton />}>
          <div className="flex flex-col h-full border-r border-[#2d2d30] bg-[#1e1e1e] text-gray-300">
            {!root ? (
              <NoFolder />
            ) : (
              <>
                <FileHeader
                  handleCreateFile={handleCreateFile}
                  handleCreateFolder={handleCreateFolder}
                />

                <FolderItem
                  item={root}
                  roomId={roomId}
                  creating={creating}
                  setCreating={setCreating}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
          </div>
        </Suspense>
      </ResizablePanel>

      <ShowAlert open={alert.open} reason={alert.reason} desc={alert.desc} />
    </>
  );
}

export default FileExplore;
