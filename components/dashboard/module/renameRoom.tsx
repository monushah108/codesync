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
      <DialogContent className="sm:max-w-[430px] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 shadow-2xl shadow-slate-900/10 dark:shadow-black/60 transition-colors p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3 text-center sm:text-left">
            <div className="mx-auto sm:mx-0 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <FilePenLine className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Rename Workspace
              </DialogTitle>

              <DialogDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Give your room a new name. Your code, collaborators, and history won't be affected.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="workspace-name" className="font-semibold text-slate-700 dark:text-slate-300">
                Room Name
              </label>

              <span className="text-slate-400 font-mono text-[11px]">
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
              className="h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
            />

            <div className="min-h-[18px]">
              {error ? (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Use a short, descriptive name that's easy to recognize.
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
              className="h-10 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={disabled}
              className="h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
