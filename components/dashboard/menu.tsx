"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

import {
  ExternalLink,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import Link from "next/link";
import { Room } from "@/lib/store/types/roomTypes";
import { useRoomStore } from "@/lib/store/Roomstore";
import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { RenameRoom } from "./model/renameRoom";
import { toast } from "sonner";

type MenuProps = {
  room: Room;
};

export default function Menu({ room }: MenuProps) {
  const [openRename, setOpenRename] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const shareLink = useRoomStore((state) => state.shareLinks[room._id]);

  const handleShare = async () => {
    try {
      let link = shareLink;

      if (!link) {
        const token = await RoomActions.getRoomLink(room._id);

        link = `${window.location.origin}/share/${token}`;
      }

      await navigator.clipboard.writeText(link);

      toast.success("Share link copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate share link");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${room.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await RoomActions.deleteRoom(room._id);

      toast.success("Room deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className="h-8 w-8 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 border-slate-800 bg-slate-950 text-slate-300"
        >
          {/* Open */}
          <DropdownMenuItem asChild>
            <Link
              href={`/playground/${room._id}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Link>
          </DropdownMenuItem>

          {/* Share */}
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              handleShare();
            }}
            className="flex cursor-pointer items-center gap-2"
          >
            <Link2 className="h-3.5 w-3.5" />
            Share Link
          </DropdownMenuItem>

          {/* Rename */}
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setOpenRename(true);
            }}
            className="flex cursor-pointer items-center gap-2"
          >
            <Pencil className="h-3.5 w-3.5" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-800" />

          {/* Delete */}
          <DropdownMenuItem
            disabled={isDeleting}
            onSelect={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="flex cursor-pointer items-center gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />

            {isDeleting ? "Deleting..." : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Keep Dialog OUTSIDE DropdownMenuContent */}
      <RenameRoom
        roomId={room._id}
        roomName={room.name}
        openRename={openRename}
        setOpenRename={setOpenRename}
        onRename={() => {
          setOpenRename(false);
        }}
      />
    </>
  );
}
