import { Code2 } from "lucide-react";

function EmptyPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Code2 className="h-8 w-8 text-zinc-600" />
      <p className="mt-3 text-sm text-zinc-300">No file open</p>
      <p className="text-xs text-zinc-500">Select a file from explorer</p>
    </div>
  );
}

export default EmptyPage;
