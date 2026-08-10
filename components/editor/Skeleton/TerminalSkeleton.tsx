const TerminalSkeleton = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center border-t border-[#2d2d30] bg-[#1e1e1e]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-6 w-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#3a3a3a]" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#007acc]" />
        </div>

        <div className="font-mono text-xs text-[#858585]">
          Starting terminal...
        </div>
      </div>
    </div>
  );
};

export default TerminalSkeleton;
