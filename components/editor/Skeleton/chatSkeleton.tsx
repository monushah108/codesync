const ChatSkeleton = () => {
  return (
    <div className="flex h-full flex-col border-l border-[#2d2d30] bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#2d2d30] px-3">
        <div className="flex items-center gap-2 animate-pulse">
          <div className="h-7 w-7 rounded-md bg-[#3a3d3e]" />

          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded bg-[#3a3d3e]" />
            <div className="h-2 w-16 rounded bg-[#2f3233]" />
          </div>
        </div>

        <div className="h-5 w-8 rounded bg-[#2f3233] animate-pulse" />
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto max-w-4xl space-y-6 p-4">
          {/* User message */}
          <div className="flex justify-end animate-pulse">
            <div className="max-w-[75%] space-y-2 rounded-2xl rounded-br-md bg-[#2a2d2e] px-4 py-3">
              <div className="h-3 w-40 rounded bg-[#3a3d3e]" />
              <div className="h-3 w-28 rounded bg-[#3a3d3e]" />
            </div>
          </div>

          {/* AI message */}
          <div className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#3a3d3e]" />

            <div className="space-y-2 rounded-2xl rounded-bl-md border border-[#383838] bg-[#2a2d2e] px-4 py-3">
              <div className="h-3 w-48 rounded bg-[#3a3d3e]" />
              <div className="h-3 w-64 rounded bg-[#3a3d3e]" />
              <div className="h-3 w-40 rounded bg-[#3a3d3e]" />
            </div>
          </div>

          {/* User message */}
          <div className="flex justify-end animate-pulse">
            <div className="space-y-2 rounded-2xl rounded-br-md bg-[#2a2d2e] px-4 py-3">
              <div className="h-3 w-32 rounded bg-[#3a3d3e]" />
            </div>
          </div>

          {/* AI message */}
          <div className="flex gap-3 animate-pulse">
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#3a3d3e]" />

            <div className="space-y-2 rounded-2xl rounded-bl-md border border-[#383838] bg-[#2a2d2e] px-4 py-3">
              <div className="h-3 w-56 rounded bg-[#3a3d3e]" />
              <div className="h-3 w-44 rounded bg-[#3a3d3e]" />
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[#2d2d30] p-3">
        <div className="h-10 w-full animate-pulse rounded-md bg-[#2a2d2e]" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
