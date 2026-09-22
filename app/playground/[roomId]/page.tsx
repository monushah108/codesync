import StatusBar from "@/components/editor/StatusBar";
import PlayHeader from "@/components/editor/playHeader";
import PlaygroundWorkspace from "@/components/editor/PlaygroundWorkspace";

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

  if (response.status === 401 || !response.ok) {
    return <AccessDenied />;
  }

  if (response.status === 404) {
    return <NoRoom />;
  }

  const { parentId } = await response.json();

  return (
    <div className="flex min-h-svh max-h-svh flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <PlayHeader />

      {/* Workspace (Responsive Desktop/Mobile Layout) */}
      <PlaygroundWorkspace roomId={roomId} parentId={parentId} />

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
