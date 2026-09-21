import { Code2, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1e1e1e] px-4 text-center select-none">
      <div className="flex w-full max-w-sm flex-col items-center">
        {/* VS Code Brand Watermark */}
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#2d2d30] bg-[#252526] text-[#007acc] shadow-inner">
          <Code2 className="h-8 w-8 animate-pulse" strokeWidth={1.5} />
        </div>

        {/* Brand Title */}
        <h1 className="text-sm font-semibold tracking-tight text-[#cccccc]">
          Opening <span className="text-white">Code<span className="text-[#007acc]">Sync</span></span> Workspace
        </h1>

        {/* Loading Spinner & Status */}
        <div className="mt-2.5 flex items-center gap-2 text-xs text-[#858585]">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#007acc]" />
          <span>Preparing your collaborative editor...</span>
        </div>

        {/* VS Code Signature Progress Track */}
        <div className="mt-6 h-1 w-56 overflow-hidden rounded-full bg-[#252526] border border-[#2d2d30]">
          <div className="h-full w-2/5 rounded-full bg-[#007acc] animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>

        {/* Footnote / Tag */}
        <p className="mt-8 text-[10px] font-mono tracking-wider text-[#5a5a5a]">
          CODESYNC • INITIALIZING WORKSPACE
        </p>
      </div>
    </main>
  );
}
