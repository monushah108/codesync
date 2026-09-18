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

  const IsChat = activePanel == "chat";
  const IsPreview = activePanel == "preview";
  const isOpen = IsChat || IsPreview;

  return (
    <ResizablePanel
      defaultSize={isOpen ? 35 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
      className="min-w-0 border-l border-[#2d2d30]"
    >
      <div className="flex h-full min-w-0 flex-col overflow-hidden bg-[#181818]">
        {/* Sidebar Content */}

        <div className="min-h-0 flex-1 overflow-hidden">
          {IsChat && !IsPreview && (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          )}

          {IsPreview && !IsChat && (
            <Suspense fallback={<PreviewSkeleton />}>
              <PreviweTab parentId={parentId} />
            </Suspense>
          )}
        </div>
      </div>
    </ResizablePanel>
  );
}
