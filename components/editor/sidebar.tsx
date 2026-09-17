"use client";

import { Suspense } from "react";
import { Eye, MessageSquare } from "lucide-react";

import { useRoomStore } from "@/lib/store/Roomstore";
import { useLayout } from "@/context/layout-context";

import { ResizablePanel } from "../ui/resizable";
import { Button } from "../ui/button";

import ChatSkeleton from "./Skeleton/chatSkeleton";
import PreviewSkeleton from "./Skeleton/previewSkeleton";

import Chat from "./chat";
import PreviweTab from "./ui/previweTab";

export default function Sidebar({
  roomId,
  parentId,
}: {
  roomId: string;
  parentId: string;
}) {
  const { panels, open, close } = useLayout();

  const isChat = panels.chat;
  const isPreview = panels.previewTab;

  const activeTab = isChat ? isChat : isPreview;

  return (
    <ResizablePanel
      defaultSize={activeTab ? 35 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
      className="border-l border-[#2d2d30]"
    >
      <div className="flex h-full min-w-0 flex-col bg-[#181818]">
        {/* Content */}
        <div className="min-h-0 flex-1">
          {isChat && (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          )}

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
