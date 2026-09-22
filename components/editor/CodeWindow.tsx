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
  isPanel = true,
}: {
  roomId: string;
  isPanel?: boolean;
}) {
  const terminalRef = useRef<PanelImperativeHandle>(null);
  const isTerminalOpen = useLayoutstore((s) => s.panels.terminal);
  const setPanel = useLayoutstore((s) => s.setPanel);

  useEffect(() => {
    if (isTerminalOpen) {
      if (terminalRef.current?.isCollapsed()) {
        terminalRef.current?.expand();
        terminalRef.current?.resize(35);
      }
    } else {
      if (!terminalRef.current?.isCollapsed()) {
        terminalRef.current?.collapse();
      }
    }
  }, [isTerminalOpen]);

  if (!isPanel) {
    return (
      <div className="relative flex h-full w-full flex-1 min-h-0 flex-col bg-[#1e1e1e] overflow-hidden">
        {/* Editor Area */}
        <div className="relative flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden">
          <Suspense fallback={<EditorSkeleton />}>
            <MonacoEditor roomId={roomId} />
          </Suspense>
        </div>

        {/* Terminal */}
        {isTerminalOpen && (
          <div className="h-64 sm:h-72 w-full shrink-0 border-t border-[#2d2d30] flex flex-col overflow-hidden">
            <Suspense fallback={<TerminalSkeleton />}>
              <Terminal />
            </Suspense>
          </div>
        )}
      </div>
    );
  }

  const groupContent = (
    <ResizablePanelGroup orientation="vertical" className="h-full w-full">
      {/* Editor Area */}
      <ResizablePanel defaultSize={isTerminalOpen ? 65 : 100} minSize={20}>
        <div className="relative flex h-full min-h-0 w-full flex-col bg-[#1e1e1e] overflow-hidden">
          {/* Content */}
          <div className="relative flex-1 min-h-0 w-full h-full flex flex-col overflow-hidden">
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
        defaultSize={isTerminalOpen ? 35 : 0}
        minSize={15}
        collapsible
        collapsedSize={0}
      >
        <Suspense fallback={<TerminalSkeleton />}>
          <Terminal />
        </Suspense>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <ResizablePanel defaultSize={60}>
      {groupContent}
    </ResizablePanel>
  );
});

export default CodeWindow;
