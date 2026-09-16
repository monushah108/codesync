export default function PreviewSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#181818] animate-pulse">
      {/* Preview Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-14 rounded bg-[#3a3a3d]" />
          <div className="h-2.5 w-16 rounded bg-[#303033]" />
        </div>

        <div className="flex items-center gap-1">
          <div className="size-7 rounded bg-[#303033]" />
          <div className="size-7 rounded bg-[#303033]" />
          <div className="size-7 rounded bg-[#303033]" />
        </div>
      </div>

      {/* Browser Bar */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1f1f1f] px-2">
        <div className="size-7 rounded bg-[#303033]" />
        <div className="size-7 rounded bg-[#303033]" />
        <div className="size-7 rounded bg-[#303033]" />

        <div className="flex h-7 min-w-0 flex-1 items-center rounded-md border border-[#333333] bg-[#181818] px-2.5">
          <div className="h-2.5 w-40 max-w-full rounded bg-[#303033]" />
        </div>

        <div className="size-7 rounded bg-[#303033]" />
      </div>

      {/* Preview Content */}
      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#1e1e1e]">
        <div className="flex w-full max-w-sm flex-col items-center px-6">
          {/* Icon */}
          <div className="size-12 rounded-full bg-[#252526] border border-[#333333]" />

          {/* Title */}
          <div className="mt-5 h-3.5 w-32 rounded bg-[#333333]" />

          {/* Description */}
          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <div className="h-2.5 w-52 rounded bg-[#2d2d30]" />
            <div className="h-2.5 w-40 rounded bg-[#2d2d30]" />
          </div>

          {/* Button */}
          <div className="mt-5 h-8 w-28 rounded-md bg-[#303033]" />
        </div>
      </div>
    </div>
  );
}
