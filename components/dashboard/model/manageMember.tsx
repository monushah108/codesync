import { useState } from "react";
import {
  UserPlus,
  Ban,
  Trash2,
  Users,
  MoreVertical,
  Search,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMemberStore } from "@/lib/store/Memberstore";

type Action = "invite" | "ban" | "remove" | null;

export function ManageMember({ s, open, onOpenChange, roomId }) {
  const [action, setAction] = useState<Action>(null);
  const [selectedMember, setSelectedMember] = useState<null>(null);
  const members = useMemberStore((s) => s.data[roomId]) || [];
  const inviteMember = () => {};
  const banMember = () => {};
  const removeMember = () => {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {action === "invite" && "Invite Member"}
            {action === "ban" && "Ban Member"}
            {action === "remove" && "Remove Member"}
          </DialogTitle>

          <DialogDescription>
            {action === "invite" &&
              `Send an invitation to ${selectedMember?.name}.`}

            {action === "ban" &&
              `Are you sure you want to ban ${selectedMember?.name}? They won't be able to join this room.`}

            {action === "remove" &&
              `Remove ${selectedMember?.name} from this room? They can be invited again later.`}
          </DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput placeholder="search user" />
        </InputGroup>
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent"
          >
            <Avatar className="size-10">
              <AvatarImage src={member.image ?? ""} />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            {member.isLive && (
              <>
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background" />
                <span className="absolute bottom-0 right-0 size-3 animate-ping rounded-full bg-green-500 opacity-75" />
              </>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{member.name}</p>

              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => inviteMember(member._id)}>
                  <UserPlus className="mr-2 size-4" />
                  Invite
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => banMember(member._id)}>
                  <Ban className="mr-2 size-4 text-amber-500" />
                  Ban
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => removeMember(member._id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
}
