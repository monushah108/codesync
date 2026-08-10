const EditorSkeleton = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-[#3a3a3a]" />

          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#007acc]" />
        </div>

        {/* Loading text */}
        <div className="text-xs text-[#858585]">Loading editor...</div>
      </div>
    </div>
  );
};

export default EditorSkeleton;
