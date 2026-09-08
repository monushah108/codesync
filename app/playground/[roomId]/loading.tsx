// app/playground/[id]/loading.tsx

import { Code2, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1117]">
      <div className="flex w-full max-w-sm flex-col items-center px-6">
        {/* Icon */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Code2 className="h-7 w-7 text-indigo-400" />
        </div>

        {/* Text */}
        <h1 className="text-lg font-medium text-white">Opening workspace</h1>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Preparing your editor...
        </div>

        {/* Progress */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-indigo-500" />
        </div>
      </div>
    </main>
  );
}
