"use client";

import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  onPointerDown,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-resizing", "true");
      const cleanup = () => {
        document.body.removeAttribute("data-resizing");
        window.removeEventListener("pointerup", cleanup);
        window.removeEventListener("pointercancel", cleanup);
        window.removeEventListener("mouseup", cleanup);
        window.removeEventListener("touchend", cleanup);
      };
      window.addEventListener("pointerup", cleanup);
      window.addEventListener("pointercancel", cleanup);
      window.addEventListener("mouseup", cleanup);
      window.addEventListener("touchend", cleanup);
    }
    onPointerDown?.(e);
  };

  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      onPointerDown={handlePointerDown}
      className={cn(
        // Base handle
        "group relative flex w-px items-center justify-center",
        "bg-[#2d2d30]",

        // Bigger invisible hit area
        "after:absolute after:inset-y-0 after:left-1/2",
        "after:w-2 after:-translate-x-1/2",

        // Focus
        "focus-visible:outline-none",
        "focus-visible:ring-1",
        "focus-visible:ring-[#007acc]",

        // Horizontal handle
        "aria-[orientation=horizontal]:h-px",
        "aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:left-0",
        "aria-[orientation=horizontal]:after:top-1/2",
        "aria-[orientation=horizontal]:after:h-2",
        "aria-[orientation=horizontal]:after:w-full",
        "aria-[orientation=horizontal]:after:-translate-x-0",
        "aria-[orientation=horizontal]:after:-translate-y-1/2",

        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            // Grip container
            "pointer-events-none z-10",
            "flex items-center justify-center",
            "rounded-sm",
            "border border-[#3a3a3d]",
            "bg-[#252526]",
            "shadow-sm",

            // Vertical handle
            "h-7 w-3",

            // Horizontal handle
            "aria-[orientation=horizontal]:h-3",
            "aria-[orientation=horizontal]:w-7",
          )}
        >
          <div
            className="
              flex flex-col
              items-center
              justify-center
              gap-[2px]
              aria-[orientation=horizontal]:flex-row
            "
          >
            <span className="size-[2px] shrink-0 rounded-full bg-[#858585]" />
            <span className="size-[2px] shrink-0 rounded-full bg-[#858585]" />
            <span className="size-[2px] shrink-0 rounded-full bg-[#858585]" />
          </div>
        </div>
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
