import { useEffect, useMemo, useState, useTransition } from "react";
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
  useEffect(() => {
    if (openRename) {
      setName(roomName);
    }
  }, [openRename, roomName]);

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

    setIsPending(async () => await RoomActions.renameRoom(roomId, name));

    onRename(trimmed);
  };

  return (
    <Dialog open={openRename} onOpenChange={setOpenRename}>
      <DialogContent className="sm:max-w-[430px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <FilePenLine className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-2 text-center">
              <DialogTitle className="text-xl font-semibold">
                Rename Workspace
              </DialogTitle>

              <DialogDescription className="text-sm leading-6">
                Give your workspace a new name. Your files, collaborators,
                settings, and history won't be affected.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-6">
            <div className="flex items-center justify-between">
              <label htmlFor="workspace-name" className="text-sm font-medium">
                Workspace Name
              </label>

              <span className="text-xs text-muted-foreground">
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
            />

            <div className="min-h-[20px]">
              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Choose a short, descriptive name that's easy for your team to
                  recognize.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpenRename(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={disabled}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
