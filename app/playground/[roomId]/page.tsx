import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import StatusBar from "@/components/editor/StatusBar";

import PlayHeader from "@/components/editor/playHeader";

import CodeWindow from "@/components/editor/CodeWindow";

import FileExplore from "@/components/editor/FileExplore";

import Chat from "@/components/editor/chat";
import NoRoom from "@/components/editor/ui/noRoom";
import { cookies } from "next/headers";
import AccessDenied from "@/components/editor/ui/AccessDenied";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = await params;
  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/playground/${roomId}`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (response.status == 401 || response.status == 400) {
    return <AccessDenied />;
  }
  if (response.status == 404) {
    return <NoRoom />;
  }

  if (!response.ok) {
    return <AccessDenied />;
  }

  const { parentId } = await response.json();

  return (
    <div className=" flex flex-col min-h-svh max-h-svh  bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Header */}
      <PlayHeader />

      <ResizablePanelGroup orientation="horizontal" className="flex-1 w-full">
        {/* File Explorer */}

        <FileExplore roomId={roomId} parentId={parentId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        {/* Center Column */}
        <CodeWindow roomId={roomId} />

        <ResizableHandle className="bg-[#2d2d30] hover:bg-blue-500 transition-colors duration-200" />

        <Chat />
      </ResizablePanelGroup>

      <StatusBar />
    </div>
  );
}
