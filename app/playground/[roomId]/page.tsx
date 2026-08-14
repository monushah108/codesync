import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import StatusBar from "@/components/editor/StatusBar";

import PlayHeader from "@/components/editor/playHeader";

import CodeWindow from "@/components/editor/CodeWindow";

import FileExplore from "@/components/editor/FileExplore";

import Chat from "@/components/editor/chat";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = await params;

  return (
    <div className=" flex flex-col min-h-svh max-h-svh  bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Header */}
      <PlayHeader />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 w-full">
        {/* File Explorer */}

        <FileExplore roomId={roomId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        {/* Center Column */}
        <CodeWindow roomId={roomId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        <Chat />
      </ResizablePanelGroup>

      <StatusBar roomId={roomId} />
    </div>
  );
}
