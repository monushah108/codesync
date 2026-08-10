export default function FileItemSkeleton() {
  return (
    <div className="animate-pulse space-y-1">
      <div className="flex items-center gap-2 py-1">
        <div className="w-4 h-4 bg-[#3a3d3e] rounded" />
        <div className="h-3 w-24 bg-[#3a3d3e] rounded" />
      </div>

      <div className="ml-5 flex items-center gap-2 py-1">
        <div className="w-4 h-4 bg-[#3a3d3e] rounded" />
        <div className="h-3 w-32 bg-[#3a3d3e] rounded" />
      </div>

      <div className="ml-5 flex items-center gap-2 py-1">
        <div className="w-4 h-4 bg-[#3a3d3e] rounded" />
        <div className="h-3 w-20 bg-[#3a3d3e] rounded" />
      </div>

      <div className="ml-5 flex items-center gap-2 py-1">
        <div className="w-4 h-4 bg-[#3a3d3e] rounded" />
        <div className="h-3 w-28 bg-[#3a3d3e] rounded" />
      </div>
    </div>
  );
}
