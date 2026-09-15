"use client";

import { Check, Copy, Maximize2 } from "lucide-react";
import { useState } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MdMsg from "../ui/mdMsg";

interface ExpandCodeProps {
  content: string;
}

export default function ExpandCode({ content }: ExpandCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy response:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="
            flex
            items-center
            gap-1.5
            rounded-md
            px-2
            py-1
            text-[11px]
            text-blue-400
            transition-colors
            hover:bg-blue-500/10
            hover:text-blue-300
          "
        >
          <Maximize2 className="h-3.5 w-3.5" />
          View Full Code
        </button>
      </DialogTrigger>

      <DialogContent
        className="
          max-h-[90vh]
          w-[calc(100%-2rem)]
          max-w-4xl
          overflow-hidden
          border-[#303033]
          bg-[#18181b]
          p-0
          text-zinc-100
        "
      >
        <DialogHeader className="border-b border-[#303033] px-5 py-4">
          <DialogTitle className="text-sm font-medium">
            Full AI Response
          </DialogTitle>
        </DialogHeader>

        <ScrollArea.Root className="max-h-[calc(90vh-80px)] overflow-hidden">
          <ScrollArea.Viewport className="h-full max-h-[calc(90vh-80px)] w-full">
            <div className="px-5 py-4">
              <MdMsg content={content} />

              <div className="mt-4 flex justify-end border-t border-[#29292c] pt-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-md
                    px-2
                    py-1
                    text-xs
                    text-zinc-400
                    transition-colors
                    hover:bg-[#27272a]
                    hover:text-zinc-100
                  "
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Response
                    </>
                  )}
                </button>
              </div>
            </div>
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            orientation="vertical"
            className="
              flex
              w-2
              touch-none
              select-none
              bg-transparent
              p-0.5
            "
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-zinc-700" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </DialogContent>
    </Dialog>
  );
}
