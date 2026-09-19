"use client";

import { Suspense } from "react";

import { useLayoutstore } from "@/lib/store/Layoutstore";

import { ResizablePanel } from "../ui/resizable";

import ChatSkeleton from "./Skeleton/chatSkeleton";
import PreviewSkeleton from "./Skeleton/previewSkeleton";

import Chat from "./chat";
import PreviweTab from "./ui/previweTab";

export default function Sidebar({ parentId }: { parentId: string }) {
  const activePanel = useLayoutstore((state) => state.activePanel);
  const panel = useLayoutstore((s) => s.panels);
  const isChat = panel.chat;
  const isPreview = panel.preview;

  // Sidebar is opened only when one of its sidebar panels is enabled
  const isOpen = isChat || isPreview;

  return (
    <ResizablePanel
      defaultSize={isOpen ? 35 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
      className="min-w-0 border-l border-[#2d2d30]"
    >
      <div className="flex h-full min-w-0 flex-col overflow-hidden bg-[#181818]">
        <div className="min-h-0 flex-1 overflow-hidden">
          {isChat ||
            (activePanel && (
              <Suspense fallback={<ChatSkeleton />}>
                <Chat />
              </Suspense>
            ))}

          {isPreview && (
            <Suspense fallback={<PreviewSkeleton />}>
              <PreviweTab parentId={parentId} />
            </Suspense>
          )}
        </div>
      </div>
    </ResizablePanel>
  );
}
