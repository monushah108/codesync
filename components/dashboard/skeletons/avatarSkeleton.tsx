export function AvatarStackSkeleton() {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="size-7 rounded-full border-2 border-background bg-muted animate-pulse"
          />
        ))}

        <div className="size-7 rounded-full border-2 border-background bg-muted animate-pulse" />
      </div>

      <div className="-ml-[7px] size-7 rounded-full border border-border bg-muted animate-pulse" />
    </div>
  );
}
