import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2 } from "lucide-react";

interface RenameRoomProp {
  openRename: boolean;
  setOpenRename: (open: boolean) => void;
  roomName: string;
  loading?: boolean;
  //   onRename: (name: string) => void;
}

export function RenameRoom({
  openRename,
  setOpenRename,
  roomName,
  loading = false,
  //   onRename,
}: RenameRoomProp) {
  const [name, setName] = useState(roomName);

  useEffect(() => {
    if (openRename) setName(roomName);
  }, [open, roomName]);

  const disabled = loading || !name.trim() || name.trim() === roomName;

  return (
    <Dialog open={openRename} onOpenChange={setOpenRename}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Pencil className="h-6 w-6 text-primary" />
          </div>

          <DialogTitle className="text-center">Rename Workspace</DialogTitle>

          <DialogDescription className="text-center">
            Give your workspace a new name. This won't affect its files,
            members, or settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="text-sm font-medium">Workspace Name</label>

          <Input
            autoFocus
            maxLength={30}
            value={name}
            placeholder="Enter workspace name..."
            onChange={(e) => setName(e.target.value)}
          />

          <p className="text-xs text-muted-foreground">
            {name.length}/5 characters
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpenRename(false)}>
            Cancel
          </Button>

          <Button
            disabled={disabled}
            //    onClick={() => onRename(name.trim())}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
