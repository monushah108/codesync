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
      const link = `${window.location.origin}/playground/${room._id}`;

      await navigator.clipboard.writeText(link);

      toast.success("Share link copied");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate share link");
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await RoomActions.deleteRoom(room._id);

      toast.success("Room deleted");
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
      {/* Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="
              h-8 w-8
              text-slate-500
              hover:bg-slate-800
              hover:text-slate-200
              data-[state=open]:bg-slate-800
              data-[state=open]:text-slate-200
            "
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
            onSelect={(event) => {
              event.preventDefault();
              setOpenDelete(true);
            }}
            className="
              flex cursor-pointer items-center gap-2
              text-red-400
              focus:bg-red-500/10
              focus:text-red-400
            "
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
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

      {/* Delete Confirmation */}
      <AlertDialog
        open={openDelete}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setOpenDelete(open);
          }
        }}
      >
        <AlertDialogContent className="border-slate-800 bg-slate-950 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-slate-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                <Trash2 className="h-4 w-4 text-red-400" />
              </div>
              Delete room?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-300">"{room.name}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="
                border-slate-800
                bg-transparent
                text-slate-400
                hover:bg-slate-900
                hover:text-slate-200
              "
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              className="
                bg-red-600
                text-white
                hover:bg-red-500
                focus:ring-red-500/30
              "
            >
              {isDeleting ? "Deleting..." : "Delete room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
