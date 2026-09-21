const ChatSkeleton = () => {
  return (
    <div className="flex h-full flex-col bg-[#181818] select-none">
      {/* VS Code Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="size-3.5 rounded-sm bg-[#333333]" />
          <div className="h-3 w-12 rounded-sm bg-[#333333]" />
          <div className="h-3 w-14 rounded-sm bg-[#2d2d30]" />
        </div>

        <div className="flex items-center gap-1 animate-pulse">
          <div className="size-5 rounded-sm bg-[#2d2d30]" />
          <div className="size-5 rounded-sm bg-[#2d2d30]" />
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-hidden p-3 space-y-3">
        {/* User message card */}
        <div className="rounded-sm border border-[#2d2d30] bg-[#222225] p-3 space-y-2 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-sm bg-[#3a3d3e]" />
              <div className="h-3 w-16 rounded-sm bg-[#3a3d3e]" />
            </div>
            <div className="size-3 rounded-sm bg-[#2d2d30]" />
          </div>
          <div className="h-3 w-3/4 rounded-sm bg-[#333333]" />
          <div className="h-3 w-1/2 rounded-sm bg-[#333333]" />
        </div>

        {/* AI response card */}
        <div className="rounded-sm border border-[#2d2d30] bg-[#1e1e1e] p-3 space-y-3 animate-pulse">
          <div className="flex items-center justify-between border-b border-[#2d2d30] pb-2">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-sm bg-[#007acc]/20" />
              <div className="h-3 w-20 rounded-sm bg-[#333333]" />
            </div>
            <div className="h-2.5 w-14 rounded-sm bg-[#2d2d30]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded-sm bg-[#2d2d30]" />
            <div className="h-3 w-5/6 rounded-sm bg-[#2d2d30]" />
            <div className="h-3 w-2/3 rounded-sm bg-[#2d2d30]" />
          </div>
          <div className="h-16 w-full rounded-sm border border-[#2d2d30] bg-[#252526]" />
        </div>
      </div>

      {/* Input Box Skeleton */}
      <div className="shrink-0 border-t border-[#2d2d30] bg-[#181818] p-3 space-y-2">
        <div className="h-3.5 w-28 rounded-sm bg-[#252526] animate-pulse" />
        <div className="h-16 w-full rounded-sm border border-[#3c3c3c] bg-[#252526] animate-pulse" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
