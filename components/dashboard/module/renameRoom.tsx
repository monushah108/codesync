"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FilePenLine } from "lucide-react";
import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { toast } from "sonner";

interface RenameRoomProps {
  roomId: string;
  openRename: boolean;
  setOpenRename: (open: boolean) => void;
  roomName: string;
  onRename: (name: string) => void;
}

export function RenameRoom({
  roomId,
  openRename,
  setOpenRename,
  roomName,
  onRename,
}: RenameRoomProps) {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(roomName);
    }
    setOpenRename(open);
  };

  const trimmed = useMemo(() => name.trim(), [name]);

  const error =
    trimmed.length > 0 && trimmed.length < 3
      ? "Workspace name must be at least 3 characters."
      : null;

  const disabled =
    isPending || trimmed.length < 3 || trimmed === roomName.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disabled) return;

    try {
      await new Promise<void>((resolve, reject) => {
        setIsPending(async () => {
          try {
            await RoomActions.renameRoom(roomId, trimmed);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      toast.success("Room renamed successfully!");
      onRename(trimmed);
      setOpenRename(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename room");
    }
  };

  return (
    <Dialog open={openRename} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl border border-[#cecece] dark:border-[#3c3c3c] bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-[#cccccc] shadow-2xl shadow-black/50 transition-colors p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
              <FilePenLine className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-base font-bold text-[#1e1e1e] dark:text-white">
                Rename Workspace
              </DialogTitle>

              <DialogDescription className="text-xs text-[#6e6e6e] dark:text-[#858585] leading-relaxed">
                Give your room a new name. Your code, collaborators, and history will not be affected.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="workspace-name" className="font-semibold text-[#1e1e1e] dark:text-[#cccccc]">
                Room Name
              </label>

              <span className="text-[#858585] font-mono text-[11px]">
                {trimmed.length}/30
              </span>
            </div>

            <Input
              id="workspace-name"
              autoFocus
              maxLength={30}
              value={name}
              placeholder="Enter workspace name..."
              onFocus={(e) => e.target.select()}
              onChange={(e) => setName(e.target.value.replace(/^\s+/, ""))}
              className="h-9 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#f8f8f8] dark:bg-[#1e1e1e] text-xs text-[#1e1e1e] dark:text-white placeholder:text-[#858585] focus-visible:ring-1 focus-visible:ring-[#007acc]"
            />

            <div className="min-h-[16px]">
              {error ? (
                <p className="text-xs text-[#e51400] dark:text-[#f14c4c] font-medium">{error}</p>
              ) : (
                <p className="text-[11px] text-[#858585]">
                  Use a short, descriptive name that is easy to recognize.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpenRename(false)}
              className="h-9 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#e0e0e0] dark:hover:bg-[#2a2d2e] text-xs font-medium transition-colors"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={disabled}
              className="h-9 rounded-md bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium shadow-xs disabled:opacity-50 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Renaming...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
