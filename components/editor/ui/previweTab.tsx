"use client";

import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Link2Off,
  Lock,
  MoreHorizontal,
  RefreshCw,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PreviweTab() {
  // Later this will come from your layout/context state
  const connected = false;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#181818]">
      {/* Preview Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#cccccc]">Preview</span>

          {connected ? (
            <span className="flex items-center gap-1 text-[10px] text-[#858585]">
              <span className="size-1.5 rounded-full bg-green-500" />
              Running
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-[#858585]">
              <span className="size-1.5 rounded-full bg-[#666666]" />
              Disconnected
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            title="Refresh Preview"
            disabled={!connected}
            className="
              size-7 rounded-sm
              text-[#858585]
              hover:bg-[#333333]
              hover:text-white
              disabled:opacity-40
            "
          >
            <RefreshCw className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Open in New Tab"
            disabled={!connected}
            className="
              size-7 rounded-sm
              text-[#858585]
              hover:bg-[#333333]
              hover:text-white
              disabled:opacity-40
            "
          >
            <ExternalLink className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Disconnect Preview"
            disabled={!connected}
            className="
              size-7 rounded-sm
              text-[#858585]
              hover:bg-red-500/10
              hover:text-red-400
              disabled:opacity-40
            "
          >
            <Link2Off className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Browser Bar */}
      <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1f1f1f] px-2">
        {/* Back */}
        <Button
          variant="ghost"
          size="icon"
          disabled={!connected}
          title="Back"
          className="
            size-7 shrink-0 rounded-sm
            text-[#858585]
            hover:bg-[#333333]
            hover:text-[#cccccc]
            disabled:opacity-40
          "
        >
          <ArrowLeft className="size-3.5" />
        </Button>

        {/* Forward */}
        <Button
          variant="ghost"
          size="icon"
          disabled={!connected}
          title="Forward"
          className="
            size-7 shrink-0 rounded-sm
            text-[#858585]
            hover:bg-[#333333]
            hover:text-[#cccccc]
            disabled:opacity-40
          "
        >
          <ArrowRight className="size-3.5" />
        </Button>

        {/* Reload */}
        <Button
          variant="ghost"
          size="icon"
          disabled={!connected}
          title="Reload"
          className="
            size-7 shrink-0 rounded-sm
            text-[#858585]
            hover:bg-[#333333]
            hover:text-[#cccccc]
            disabled:opacity-40
          "
        >
          <RefreshCw className="size-3.5" />
        </Button>

        {/* URL */}
        <div
          className="
            flex h-7 min-w-0 flex-1 items-center gap-2
            rounded-md border border-[#333333]
            bg-[#181818] px-2.5
          "
        >
          <Lock className="size-3 shrink-0 text-[#666666]" />

          <span className="truncate text-xs text-[#858585]">
            http://localhost:3000
          </span>
        </div>

        {/* More */}
        <Button
          variant="ghost"
          size="icon"
          title="More"
          className="
            size-7 shrink-0 rounded-sm
            text-[#858585]
            hover:bg-[#333333]
            hover:text-[#cccccc]
          "
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </div>

      {/* Preview Content */}
      {connected ? (
        <div className="relative min-h-0 flex-1 overflow-hidden bg-white">
          <iframe
            src="http://localhost:3000"
            title="CodeSync Preview"
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <DisconnectedState />
      )}
    </div>
  );
}

function DisconnectedState() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center bg-[#1e1e1e]">
      <div className="flex max-w-sm flex-col items-center px-6 text-center">
        {/* Icon */}
        <div
          className="
            mb-5 flex size-12 items-center justify-center
            rounded-full border border-[#333333]
            bg-[#252526]
          "
        >
          <Link2Off className="size-5 text-[#858585]" />
        </div>

        {/* Title */}
        <h2 className="text-sm font-medium text-[#d4d4d4]">
          Preview disconnected
        </h2>

        {/* Description */}
        <p className="mt-2 text-xs leading-5 text-[#858585]">
          The preview is currently disconnected.
          <br />
          Run the project to start it again.
        </p>

        {/* Action */}
        <Button
          variant="none"
          className="
            mt-5 h-8 gap-2 rounded-md
            bg-[#007acc] px-3
            text-xs text-white
            hover:bg-[#006bb3]
          "
        >
          <Terminal className="size-3.5" />
          Run Project
        </Button>
      </div>
    </div>
  );
}
