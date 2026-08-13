"use client";

import RoomSkeleton from "@/components/editor/Skeleton/roomskeleton";
import NoRoom from "@/components/editor/ui/noRoom";
import { GetRoomDetails } from "@/lib/api/roomApi";
import { createContext, useEffect, useState } from "react";

type RoomStatus = "checking" | "valid" | "not-found" | "invalid-id" | "error";

const RoomContext = createContext<RoomStatus>("checking");

export function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<RoomStatus>("checking");

  useEffect(() => {
    let cancelled = false;

    async function validateRoom() {
      try {
        await GetRoomDetails({ roomId });

        if (!cancelled) {
          setStatus("valid");
        }
      } catch (err: unknown) {
        if (cancelled) return;

        const error = err as { status?: number };

        if (error.status === 404) {
          setStatus("not-found");
          return;
        }

        if (error.status === 400) {
          setStatus("invalid-id");
          return;
        }

        setStatus("error");
      }
    }

    validateRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (status === "checking") {
    return <RoomSkeleton />;
  }

  if (status === "not-found" || status === "invalid-id") {
    return <NoRoom />;
  }

  if (status === "error") {
    return <NoRoom />;
  }

  return <RoomContext.Provider value={status}>{children}</RoomContext.Provider>;
}
