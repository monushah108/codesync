import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import StatusBar from "@/components/editor/StatusBar";
import PlayHeader from "@/components/editor/playHeader";
import CodeWindow from "@/components/editor/CodeWindow";
import FileExplore from "@/components/editor/FileExplore";

import NoRoom from "@/components/editor/ui/noRoom";
import { cookies } from "next/headers";
import AccessDenied from "@/components/editor/ui/AccessDenied";
import Sidebar from "@/components/editor/sidebar";

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

  if (response.status === 401 || response.status === 400) {
    return <AccessDenied />;
  }

  if (response.status === 404) {
    return <NoRoom />;
  }

  if (!response.ok) {
    return <AccessDenied />;
  }

  const { parentId } = await response.json();

  return (
    <div className="flex min-h-svh max-h-svh flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <PlayHeader />

      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 flex-1 w-full"
      >
        <FileExplore roomId={roomId} parentId={parentId} />

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

        <CodeWindow roomId={roomId} />

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

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
