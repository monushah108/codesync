import SandpackPreview from "./sandpackPreview";

export default function PreviewTab({ parentId }: { parentId: string }) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden bg-[#181818]">
      <SandpackPreview parentId={parentId} />
    </div>
  );
}
