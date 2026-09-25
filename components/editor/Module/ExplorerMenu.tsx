import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useCodestore } from "@/lib/store/Codestore";
import { Download, FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";

export default function ExplorerMenu({
  id,
  name,
  children,
  Isparent,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
  onDownload,
  downloadLabel = "Download",
}: {
  id: string;
  name: string;
  children: React.ReactNode;
  Isparent: boolean;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
  onDownload?: (id: string, name: string) => void;
  downloadLabel?: string;
}) {
  const role = useCodestore((s) => s.role);
  const isViewer = role === "viewer";

  if (isViewer && !onDownload) {
    return <>{children}</>;
  }

  const hasCreateActions = !isViewer && Boolean(onCreateFile || onCreateFolder);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

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
        {hasCreateActions && (
          <>
            {onCreateFile && (
              <ContextMenuItem
                onSelect={() => onCreateFile()}
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
                <FilePlus className="size-3.5 text-sky-400" />
                <span>New File</span>
              </ContextMenuItem>
            )}

            {onCreateFolder && (
              <ContextMenuItem
                onSelect={() => onCreateFolder()}
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
                <FolderPlus className="size-3.5 text-amber-400" />
                <span>New Folder</span>
              </ContextMenuItem>
            )}

            <ContextMenuSeparator className="my-1 bg-[#3c3c3c]" />
          </>
        )}

        {!isViewer && onRename && (
          <ContextMenuItem
            onSelect={() => onRename(id, name)}
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
            <Pencil className="size-3.5 text-neutral-300" />
            <span>Rename</span>
          </ContextMenuItem>
        )}

        {onDownload && (
          <ContextMenuItem
            onSelect={() => onDownload(id, name)}
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
            <span>{downloadLabel}</span>
          </ContextMenuItem>
        )}

        {!isViewer && Isparent && onDelete && (
          <>
            <ContextMenuSeparator className="my-1 bg-[#3c3c3c]" />

            <ContextMenuItem
              onSelect={() => onDelete(id)}
              className="
                flex items-center gap-2
                rounded-sm
                px-2.5 py-1.5
                text-sm
                text-red-400
                outline-none
                cursor-pointer
                focus:bg-red-500/10
                focus:text-red-300
              "
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

