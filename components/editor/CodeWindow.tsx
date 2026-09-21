"use client";

import React, { lazy, Suspense, useEffect, useRef } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";

import EditorSkeleton from "./Skeleton/codeWindowSkeleton";
import TerminalSkeleton from "./Skeleton/TerminalSkeleton";

import { useLayoutstore } from "@/lib/store/Layoutstore";

const Terminal = lazy(() => import("./Terminal"));
const MonacoEditor = lazy(() => import("./MonacoEditor"));

const CodeWindow = React.memo(function CodeWindow({
  roomId,
}: {
  roomId: string;
}) {
  const terminalRef = useRef<PanelImperativeHandle>(null);
  const isTerminalOpen = useLayoutstore((s) => s.panels.terminal);
  const setPanel = useLayoutstore((s) => s.setPanel);

  useEffect(() => {
    if (isTerminalOpen) {
      terminalRef.current?.expand();
    } else {
      terminalRef.current?.collapse();
    }
  }, [isTerminalOpen]);

  return (
    <ResizablePanel defaultSize={60}>
      <ResizablePanelGroup orientation="vertical" className="h-full">
        {/* Editor Area */}
        <ResizablePanel defaultSize={60} minSize={20}>
          <div className="flex h-full flex-col bg-[#1e1e1e]">
            {/* Content */}
            <div className="min-h-0 flex-1">
              <Suspense fallback={<EditorSkeleton />}>
                <MonacoEditor roomId={roomId} />
              </Suspense>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="h-px bg-[#2d2d30] hover:bg-[#007acc] data-[resize-handle-active]:bg-[#007acc] transition-colors duration-150" />

        {/* Terminal */}
        <ResizablePanel
          panelRef={terminalRef}
          defaultSize={isTerminalOpen ? 40 : 0}
          minSize={15}
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
