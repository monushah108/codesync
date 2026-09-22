"use client";

import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import FileExplore from "./FileExplore";
import CodeWindow from "./CodeWindow";
import Sidebar from "./sidebar";
import Chat from "./chat";
import PreviweTab from "./preview/previweTab";
import ChatSkeleton from "./Skeleton/chatSkeleton";
import PreviewSkeleton from "./Skeleton/previewSkeleton";

import { useLayoutstore } from "@/lib/store/Layoutstore";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

interface PlaygroundWorkspaceProps {
  roomId: string;
  parentId: string;
}

export default function PlaygroundWorkspace({
  roomId,
  parentId,
}: PlaygroundWorkspaceProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  const panels = useLayoutstore((s) => s.panels);
  const closePanel = useLayoutstore((s) => s.closePanel);

  const isExplorerOpen = panels.explorer;
  const isChatOpen = panels.chat;
  const isPreviewOpen = panels.preview;

  useEffect(() => {
    setMounted(true);
    // On mobile devices, collapse explorer initially so code editor is immediately visible and accessible
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      closePanel("explorer");
    }
  }, [closePanel]);

  // Desktop layout (or before client mount for SSR)
  if (!mounted || !isMobile) {
    return (
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1 w-full"
      >
        <FileExplore roomId={roomId} parentId={parentId} isPanel={true} />

        <ResizableHandle
          withHandle
          className="
            relative w-px
            border-none
            bg-[#2d2d30]
            transition-colors
            hover:bg-[#007acc]
            data-[resize-handle-active]:bg-[#007acc]
          "
        />

        <CodeWindow roomId={roomId} isPanel={true} />

        <ResizableHandle
          withHandle
          className="
            relative w-px
            border-none
            bg-[#2d2d30]
            transition-colors
            hover:bg-[#007acc]
            data-[resize-handle-active]:bg-[#007acc]
          "
        />

        <Sidebar parentId={parentId} />
      </ResizablePanelGroup>
    );
  }

  // Mobile layout: Full-width CodeWindow with overlay slide-over drawers for Explorer, Chat, and Preview
  return (
    <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#1e1e1e] flex flex-col">
      {/* 1. Main Content: Full-width Code Editor + Terminal */}
      <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden">
        <CodeWindow roomId={roomId} isPanel={false} />
      </div>

      {/* 2. Mobile Drawer Overlay: File Explorer */}
      <AnimatePresence>
        {isExplorerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Dark Backdrop with tap-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => closePanel("explorer")}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 290 }}
              className="relative z-10 h-full w-[85vw] max-w-[320px] bg-[#1e1e1e] shadow-2xl border-r border-[#2d2d30] flex flex-col"
            >
              <FileExplore
                roomId={roomId}
                parentId={parentId}
                isPanel={false}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Mobile Drawer Overlay: Chat (AI Copilot) */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Dark Backdrop with tap-to-close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => closePanel("chat")}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 290 }}
              className="relative z-10 h-full w-[90vw] max-w-[380px] bg-[#181818] shadow-2xl border-l border-[#2d2d30] flex flex-col overflow-hidden"
            >
              <Suspense fallback={<ChatSkeleton />}>
                <Chat />
              </Suspense>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Mobile Full View Overlay: Live Preview */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#181818]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="h-full w-full flex flex-col overflow-hidden"
            >
              <Suspense fallback={<PreviewSkeleton />}>
                <PreviweTab parentId={parentId} />
              </Suspense>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
