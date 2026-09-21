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
            className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1017] p-1.5 text-slate-700 dark:text-slate-300 shadow-xl shadow-slate-900/10 dark:shadow-black/50"
        >
          {/* Open Room */}
          <DropdownMenuItem asChild>
            <Link
              href={`/playground/${room._id}`}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
              <span>Open Room</span>
            </Link>
          </DropdownMenuItem>

          {/* Share Link */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleShare();
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Link2 className="h-3.5 w-3.5 text-blue-500" />
            <span>Copy Link</span>
          </DropdownMenuItem>

          {/* Rename */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenRename(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Pencil className="h-3.5 w-3.5 text-amber-500" />
            <span>Rename</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/10 my-1" />

          {/* Delete */}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDelete(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Room</span>
          </DropdownMenuItem>
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
        <AlertDialogContent className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 shadow-2xl p-6">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Trash2 className="h-4 w-4" />
              </div>
              <span>Delete Workspace?</span>
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">"{room.name}"</span>?
              All collaborative files, session state, and history will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-2 mt-4">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-10 rounded-xl border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-medium"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20"
            >
              {isDeleting ? "Deleting..." : "Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
