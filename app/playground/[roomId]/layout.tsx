import { LayoutProvider } from "@/context/layout-context";
import { SocketProvider } from "@/context/socketProvider";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "room",
};

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <div>
      <LayoutProvider>
        <SocketProvider roomId={roomId}>{children}</SocketProvider>
      </LayoutProvider>
    </div>
  );
}
