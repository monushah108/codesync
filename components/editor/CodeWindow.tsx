"use client";

import React, { lazy, Suspense } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

import EditorSkeleton from "./Skeleton/codeWindowSkeleton";
import TerminalSkeleton from "./Skeleton/TerminalSkeleton";

import { useLayout } from "@/context/layout-context";

const Terminal = lazy(() => import("./Terminal"));
const MonacoEditor = lazy(() => import("./MonacoEditor"));

const CodeWindow = React.memo(function CodeWindow({
  roomId,
}: {
  roomId: string;
}) {
  const { panels } = useLayout();

  return (
    <ResizablePanel defaultSize={60}>
      <ResizablePanelGroup orientation="vertical" className="h-full">
        {/* Editor / Preview Area */}
        <ResizablePanel defaultSize={60} minSize={20}>
          <div className="flex h-full flex-col bg-[#1e1e1e]">
            {/* Workspace Tabs */}

            {/* Content */}
            <div className="min-h-0 flex-1">
              <Suspense fallback={<EditorSkeleton />}>
                <MonacoEditor roomId={roomId} />
              </Suspense>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        {/* Terminal */}
        <ResizablePanel
          defaultSize={panels.terminal ? 40 : 0}
          minSize={0}
          collapsible
          collapsedSize={0}
        >
          <Suspense fallback={<TerminalSkeleton />}>
            <Terminal />
          </Suspense>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  );
});

export default CodeWindow;
