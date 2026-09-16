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

export default function Sidebar({ roomId }: { roomId: string }) {
  const { panels, open, close } = useLayout();

  const room = useRoomStore((s) => s.rooms);

  const projectType = room.find((p) => p._id === roomId);

  const isChat = panels.chat;
  const isPreview = panels.previewTab;

  const activeTab = isChat || isPreview;

  const showChat = () => {
    open("chat");
    close("previewTab");
  };

  const showPreview = () => {
    open("previewTab");
    close("chat");
  };

  return (
    <ResizablePanel
      defaultSize={activeTab ? 35 : 0}
      minSize={0}
      collapsible
      collapsedSize={0}
      className="border-l border-[#2d2d30]"
    >
      <div className="flex h-full min-w-0 flex-col bg-[#181818]">
        {/* Sidebar Header */}
        <div className="flex h-9 shrink-0 items-center border-b border-[#2d2d30] bg-[#252526] px-1">
          <div className="flex items-center gap-0.5 rounded-md bg-[#1e1e1e] p-0.5">
            <Button
              type="button"
              variant="none"
              onClick={showChat}
              className={`
                h-7 gap-1.5 rounded-sm px-2.5 text-xs
                ${
                  isChat
                    ? "bg-[#333333] text-[#d4d4d4]"
                    : "text-[#858585] hover:bg-[#2d2d30] hover:text-[#cccccc]"
                }
              `}
            >
              <MessageSquare className="size-3.5" />
              Chat
            </Button>

            <Button
              type="button"
              variant="none"
              onClick={showPreview}
              className={`
                h-7 gap-1.5 rounded-sm px-2.5 text-xs
                ${
                  isPreview
                    ? "bg-[#333333] text-[#d4d4d4]"
                    : "text-[#858585] hover:bg-[#2d2d30] hover:text-[#cccccc]"
                }
              `}
            >
              <Eye className="size-3.5" />
              Preview
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1">
          {isChat && (
            <Suspense fallback={<ChatSkeleton />}>
              <Chat />
            </Suspense>
          )}

          {isPreview && (
            <Suspense fallback={<PreviewSkeleton />}>
              <PreviweTab />
            </Suspense>
          )}
        </div>
      </div>
    </ResizablePanel>
  );
}
