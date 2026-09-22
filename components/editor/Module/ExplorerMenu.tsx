import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useCodestore } from "@/lib/store/Codestore";
import { Pencil, Trash2 } from "lucide-react";

export default function ExplorerMenu({
  id,
  name,
  children,
  Isparent,
  onRename,
  onDelete,
}: {
  id: string;
  name: string;
  children: React.ReactNode;
  Isparent: boolean;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const role = useCodestore((s) => s.role);
  const isViewer = role === "viewer";

  if (isViewer) {
    return <>{children}</>;
  }

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
          <Pencil className="size-3.5" />
          <span>Rename</span>
        </ContextMenuItem>

        {Isparent && (
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
