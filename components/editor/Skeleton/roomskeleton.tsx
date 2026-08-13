export default function RoomSkeleton() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0b0b0b]">
      <div className="w-64 space-y-3">
        <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-white/10" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
