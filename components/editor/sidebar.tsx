"use client";

import { Suspense, useEffect, useRef } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

import { useLayoutstore } from "@/lib/store/Layoutstore";
import { ResizablePanel } from "../ui/resizable";
import ChatSkeleton from "./Skeleton/chatSkeleton";
import PreviewSkeleton from "./Skeleton/previewSkeleton";
import Chat from "./chat";
import PreviweTab from "./preview/previweTab";

export default function Sidebar({ parentId }: { parentId: string }) {
  const panelRef = useRef<PanelImperativeHandle>(null);
  const panel = useLayoutstore((s) => s.panels);
  const setPanel = useLayoutstore((s) => s.setPanel);
  const isChat = panel.chat;
  const isPreview = panel.preview;

  // Sidebar is opened only when one of its sidebar panels is enabled
  const isOpen = isChat || isPreview;

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.expand();
    } else {
      panelRef.current?.collapse();
    }
  }, [isOpen]);

  return (
    <ResizablePanel
      panelRef={panelRef}
      defaultSize={isOpen ? 35 : 0}
      minSize={20}
      collapsible
      collapsedSize={0}
      className="min-w-0 border-l border-[#2d2d30]"
    >
      <div className="flex h-full min-w-0 flex-col overflow-hidden bg-[#181818]">
        <div className="min-h-0 flex-1 overflow-hidden">
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
