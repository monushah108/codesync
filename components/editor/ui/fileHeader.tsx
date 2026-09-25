import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FilePlus,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  RotateCw,
  Trash,
  X,
} from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";
import { useLayoutstore } from "@/lib/store/Layoutstore";
import { downloadProject } from "@/lib/api/explorerApi";
import { toast } from "sonner";

interface Fileprop {
  roomId: string;
  handleCreateFile: () => void;
  handleCreateFolder: () => void;
  handleRefresh?: () => void;
}

export function FileHeader({
  roomId,
  handleCreateFile,
  handleCreateFolder,
  handleRefresh,
}: Fileprop) {
  const closePanel = useLayoutstore((s) => s.closePanel);
  const role = useCodestore((s) => s.role);
  const isViewer = role === "viewer";
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadProject = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDownloading) return;

    setIsDownloading(true);
    const toastId = toast.loading("Packaging project archive...");

    try {
      await downloadProject(roomId);
      toast.success("Project downloaded successfully!", { id: toastId });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download project";
      toast.error(message, { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col py-1 border-b border-[#2d2d30] text-xs text-gray-400 gap-2 select-none">
      <div className="flex items-center justify-between px-2">
        <span className="uppercase tracking-wide text-[11px] font-semibold text-neutral-400">
          Explorer
        </span>

        <div className="flex items-center gap-0.5">
          {isViewer ? (
            <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
              View Only
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFile();
                }}
                title="New File"
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3a3d3e] transition-colors"
              >
                <FilePlus className="size-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFolder();
                }}
                title="New Folder"
                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3a3d3e] transition-colors"
              >
                <FolderPlus className="size-4" />
              </button>
            </>
          )}

          {handleRefresh && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              title="Refresh Explorer"
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3a3d3e] transition-colors"
            >
              <RotateCw className="size-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadProject}
            disabled={isDownloading}
            title="Download Project (.zip)"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3a3d3e] transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <Loader2 className="size-3.5 animate-spin text-[#007acc]" />
            ) : (
              <Download className="size-3.5" />
            )}
          </button>

          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />

          <button
            type="button"
            onClick={() => closePanel("explorer")}
            title="Close Explorer"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3a3d3e] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

