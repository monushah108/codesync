import { Button } from "@/components/ui/button";
import { FilePlus, FolderOpen, FolderPlus } from "lucide-react";
import { useRef } from "react";

export default function NoFolder() {
  const folderRef = useRef<HTMLInputElement>(null);

  const handleOpenFolder = () => {
    ("open folder");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#2d2d30] bg-[#252526]">
        <FolderPlus className="h-6 w-6 text-zinc-500" />
      </div>

      {/* Text */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-zinc-200">No project yet</h3>

        <p className="mt-1 max-w-[220px] text-xs leading-5 text-zinc-500">
          Create a new project or open an existing folder to start coding.
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full max-w-[220px] flex-col gap-2">
        <Button
          size="sm"
          className="w-full bg-sky-500 text-white hover:bg-sky-500/90"
        >
          <FilePlus className="mr-1.5 h-4 w-4" />
          Create Project
        </Button>

        <input
          type="file"
          ref={folderRef}
          className="hidden"
          onChange={handleOpenFolder}
          {...({ webkitdirectory: "", directory: "" } as any)}
        />

        <Button
          size="sm"
          variant="outline"
          onClick={() => folderRef.current?.click()}
          className="w-full border-[#3a3d3e] bg-transparent text-zinc-300 hover:bg-[#2a2d2e] hover:text-white"
        >
          <FolderOpen className="mr-1.5 h-4 w-4" />
          Open Folder
        </Button>
      </div>
    </div>
  );
}
