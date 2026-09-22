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
import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { RenameRoom } from "./module/renameRoom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type MenuProps = {
  room: Room;
};

export default function Menu({ room }: MenuProps) {
  const [openRename, setOpenRename] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleShare = async () => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${origin}/playground/${room._id}`;

      await navigator.clipboard.writeText(link);
      toast.success("Room invite link copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await RoomActions.deleteRoom(room._id);
      toast.success("Room deleted successfully");
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-[#858585] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#eaeaea] dark:hover:bg-[#2a2d2e] border border-transparent hover:border-[#cecece] dark:hover:border-[#3c3c3c] transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 rounded-lg border border-[#cecece] dark:border-[#3c3c3c] bg-white dark:bg-[#252526] p-1 text-[#1e1e1e] dark:text-[#cccccc] shadow-xl shadow-black/20 dark:shadow-black/50"
        >
          {/* Open Room */}
          <DropdownMenuItem asChild>
            <Link
              href={`/playground/${room._id}`}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#007acc]/10 dark:hover:bg-[#04395e] hover:text-[#007acc] dark:hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#007acc] dark:text-[#3794ff]" />
              <span>Open Room</span>
            </Link>
          </DropdownMenuItem>

          {/* Share Link */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleShare();
            }}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#007acc]/10 dark:hover:bg-[#04395e] hover:text-[#007acc] dark:hover:text-white transition-colors"
          >
            <Link2 className="h-3.5 w-3.5 text-[#007acc] dark:text-[#3794ff]" />
            <span>Copy Link</span>
          </DropdownMenuItem>

          {/* Owner-only Actions */}
          {(room.isOwner || room.role === "owner") && (
            <>
              {/* Rename */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenRename(true);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#007acc]/10 dark:hover:bg-[#04395e] hover:text-[#007acc] dark:hover:text-white transition-colors"
              >
                <Pencil className="h-3.5 w-3.5 text-amber-500" />
                <span>Rename</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#e5e5e5] dark:bg-[#333333] my-1" />

              {/* Delete */}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenDelete(true);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-[#e51400] dark:text-[#f14c4c] hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Room</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rename Dialog */}
      <RenameRoom
        roomId={room._id}
        roomName={room.name}
        openRename={openRename}
        setOpenRename={setOpenRename}
        onRename={() => {
          setOpenRename(false);
        }}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={openDelete}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setOpenDelete(open);
          }
        }}
      >
        <AlertDialogContent className="sm:max-w-[420px] rounded-xl border border-[#cecece] dark:border-[#3c3c3c] bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-[#cccccc] shadow-2xl shadow-black/50 p-6">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="flex items-center gap-2.5 text-base font-bold text-[#1e1e1e] dark:text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-[#f14c4c] border border-red-500/20">
                <Trash2 className="h-4 w-4" />
              </div>
              <span>Delete Workspace?</span>
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs text-[#6e6e6e] dark:text-[#858585] leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#1e1e1e] dark:text-white font-mono">
                "{room.name}"
              </span>
              ? All collaborative files, session state, and history will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-2 mt-5">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-9 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e0e0e0] dark:hover:bg-[#2a2d2e] text-xs font-medium transition-colors"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="h-9 rounded-md bg-[#e51400] hover:bg-[#c71000] text-white text-xs font-medium shadow-xs transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
