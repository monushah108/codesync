import StatusBar from "@/components/editor/StatusBar";
import PlayHeader from "@/components/editor/playHeader";
import PlaygroundWorkspace from "@/components/editor/PlaygroundWorkspace";
import PlaygroundError from "@/components/editor/ui/PlaygroundError";
import { cookies } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = await params;
  const cookieStore = await cookies();

  let response: Response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/playground/${roomId}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );
  } catch {
    return (
      <PlaygroundError
        status={500}
        message="Unable to connect to the workspace server. Please check your network or try again."
        roomId={roomId}
      />
    );
  }

  if (!response.ok) {
    let errorMessage = "An error occurred while loading this workspace.";
    try {
      const errorData = await response.json();
      if (errorData?.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Non-JSON response
    }

    return (
      <PlaygroundError
        status={response.status}
        message={errorMessage}
        roomId={roomId}
      />
    );
  }

  const roomData = await response.json();
  const { parentId, role } = roomData;

  return (
    <div className="flex min-h-svh max-h-svh flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4]">
      {/* Header */}
      <PlayHeader roomId={roomId} />

      {/* Workspace (Responsive Desktop/Mobile Layout) */}
      <PlaygroundWorkspace
        roomId={roomId}
        parentId={parentId}
        role={role}
      />

      {/* Status Bar */}
      <StatusBar roomId={roomId} initialRole={role} />
    </div>
  );
}
