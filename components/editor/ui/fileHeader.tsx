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
  MoreHorizontal,
  Trash,
  X,
} from "lucide-react";
import { useCodestore } from "@/lib/store/Codestore";
import { useLayoutstore } from "@/lib/store/Layoutstore";

interface Fileprop {
  handleCreateFile: () => void;
  handleCreateFolder: () => void;
}

export function FileHeader({ handleCreateFile, handleCreateFolder }: Fileprop) {
  const closePanel = useLayoutstore((s) => s.closePanel);
  const role = useCodestore((s) => s.role);
  const isViewer = role === "viewer";

  return (
    <div className="flex flex-col py-1 border-b border-[#2d2d30] text-xs text-gray-400 gap-2">
      <div className="flex items-center justify-between px-2">
        <span className="uppercase tracking-wide">Explorer</span>

        <div className="flex items-center gap-1">
          {isViewer ? (
            <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
              View Only
            </span>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFile();
                }}
                title="New File"
                className="p-1 rounded hover:bg-[#3a3d3e]"
              >
                <FilePlus className="size-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFolder();
                }}
                title="New Folder"
                className="p-1 rounded hover:bg-[#3a3d3e]"
              >
                <FolderPlus className="size-4" />
              </button>
            </>
          )}

          <button className="p-1 rounded hover:bg-[#2a2d2e]" title="More Actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#2a2d2e] border-[#2a2d2e]">
                <DropdownMenuItem className="text-center text-gray-400">
                  <Trash /> delete
                </DropdownMenuItem>
                <DropdownMenuItem className="text-center text-gray-400">
                  <Download /> download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>

          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />

          <button
            type="button"
            onClick={() => closePanel("explorer")}
            title="Close Explorer"
            className="p-1 rounded hover:bg-[#3a3d3e] hover:text-white transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
