import { Code2, Command, FileCode2, Search, Terminal } from "lucide-react";

function EmptyPage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#1e1e1e] p-6 text-center select-none">
      {/* VS Code Watermark Logo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#252526] border border-[#2d2d30] text-[#007acc] shadow-inner mb-6">
        <Code2 className="h-8 w-8" strokeWidth={1.5} />
      </div>

      <h3 className="text-sm font-semibold text-[#cccccc] tracking-tight mb-1">
        CodeSync Editor
      </h3>
      <p className="text-xs text-[#858585] max-w-sm mb-6">
        Select a file from the explorer on the left or use keyboard shortcuts to get started.
      </p>

      {/* VS Code Shortcut Cheatsheet */}
      <div className="w-full max-w-xs space-y-2 text-left">
        <div className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-[#252526] transition-colors">
          <span className="text-[#858585] flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Show Command Palette</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] font-mono text-[#cccccc]">
            Ctrl + Shift + P
          </kbd>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-[#252526] transition-colors">
          <span className="text-[#858585] flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Quick Open File</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] font-mono text-[#cccccc]">
            Ctrl + P
          </kbd>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-[#252526] transition-colors">
          <span className="text-[#858585] flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Toggle Terminal</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] font-mono text-[#cccccc]">
            Ctrl + `
          </kbd>
        </div>

        <div className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-[#252526] transition-colors">
          <span className="text-[#858585] flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Find in File</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#2d2d2d] border border-[#3c3c3c] text-[10px] font-mono text-[#cccccc]">
            Ctrl + F
          </kbd>
        </div>
      </div>
    </div>
  );
}

export default EmptyPage;
