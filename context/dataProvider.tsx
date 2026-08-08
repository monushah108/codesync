"use client";

import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { useEffect } from "react";

export function DataProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    RoomActions.loadRooms();
    // memberActions.loadMembers();
    // favoriteActions.loadFavorites();
  }, []);

  return children;
}
