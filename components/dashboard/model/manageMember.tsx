import { useMemo, useState } from "react";
import {
  UserPlus,
  Ban,
  Trash2,
  MoreVertical,
  Search,
  Star,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { MemberActions } from "@/lib/store/actions/useMemberAction";

type Action = "invite" | "ban" | "remove" | null;

interface Props {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageMember({ roomId, open, onOpenChange }: Props) {
  const members = useMemberStore((s) => s.data[roomId] ?? []);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState<Action>(null);
  const [loading, setLoading] = useState(false);

  const [selectedMember, setSelectedMember] = useState<any>(null);
  const userId = useMemberStore((s) => s.user?.id);
  console.log(userId, members);
  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  const openAction = (type: Action, member: any) => {
    setSelectedMember(member);
    setAction(type);
  };

  const closeAction = () => {
    setAction(null);
    setSelectedMember(null);
  };

  const handleAction = async () => {
    if (!selectedMember || !action) return;

    try {
      setLoading(true);

      switch (action) {
        case "invite":
          await MemberActions.invite(roomId, selectedMember._id);
          break;

        case "ban":
          await MemberActions.ban(roomId, selectedMember._id);
          break;

        case "remove":
          await MemberActions.remove(roomId, selectedMember._id);
          break;
      }

      closeAction();
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (member: any) => {};

  return (
    <>
      {/* Member List */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
            <DialogDescription>
              Invite, ban or remove members.
            </DialogDescription>
          </DialogHeader>

          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>

            <InputGroupInput
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <div className="max-h-96 overflow-y-auto space-y-2 mt-4">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent"
              >
                <div className="relative">
                  <Avatar className="size-10">
                    <AvatarImage src={member.image ?? ""} />
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>

                  {member.isLive && (
                    <>
                      <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background" />
                      <span className="absolute bottom-0 right-0 size-3 animate-ping rounded-full bg-green-500 opacity-70" />
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{member.name}</p>

                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>

                {member._id !== userId && (
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleFavorite(member)}
                    >
                      <Star
                        className={`size-4 ${member.isFavourite ? "fill-current text-yellow-500" : ""}`}
                      />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openAction("invite", member)}
                        >
                          <UserPlus className="mr-2 size-4" />
                          Invite
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openAction("ban", member)}
                        >
                          <Ban className="mr-2 size-4 text-yellow-500" />
                          Ban
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => openAction("remove", member)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={!!action} onOpenChange={closeAction}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {action === "invite" && "Invite Member"}
              {action === "ban" && "Ban Member"}
              {action === "remove" && "Remove Member"}
            </DialogTitle>

            <DialogDescription>
              {action === "invite" &&
                `Send an invitation to ${selectedMember?.name}?`}

              {action === "ban" &&
                `Are you sure you want to ban ${selectedMember?.name}?`}

              {action === "remove" &&
                `Remove ${selectedMember?.name} from this room?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeAction}>
              Cancel
            </Button>

            <Button
              variant={
                action === "remove" || action === "ban"
                  ? "destructive"
                  : "default"
              }
              disabled={loading}
              onClick={handleAction}
            >
              {loading
                ? "Please wait..."
                : action === "invite"
                  ? "Invite"
                  : action === "ban"
                    ? "Ban"
                    : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
