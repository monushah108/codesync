"use client";

import { Link2Off, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DisconnectedState({ onRun }: { onRun: () => void }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center bg-[#1e1e1e]">
      <div className="flex max-w-sm flex-col items-center px-6 text-center">
        <div
          className="
            mb-5 flex size-12 items-center justify-center
            rounded-full border border-[#333333]
            bg-[#252526]
          "
        >
          <Link2Off className="size-5 text-[#858585]" />
        </div>

        <h2 className="text-sm font-medium text-[#d4d4d4]">
          Preview disconnected
        </h2>

        <p className="mt-2 text-xs leading-5 text-[#858585]">
          The preview is currently disconnected.
          <br />
          Run the project to start it again.
        </p>

        <Button
          variant="none"
          onClick={onRun}
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
