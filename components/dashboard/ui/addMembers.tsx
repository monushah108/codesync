import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { loadFavorites } from "@/lib/store/actions/favoriteAction";

type Collaborator = {
  _id: string;
  name: string;
  email: string;
  image?: string;
  added?: boolean;
};

interface AddMembersProps {
  members: Collaborator[];
  loading?: boolean;
  onAdd: (user: Collaborator) => Promise<void> | void;
}

export default function AddMembers({
  members = [],
  loading,
  onAdd,
}: AddMembersProps) {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const [localMembers, setLocalMembers] = useState(members ?? []);

  useEffect(() => {
    // loadFavorites()
    setLocalMembers(members ?? []);
  }, [members]);

  const filtered = useMemo(() => {
    const list = localMembers ?? [];
    if (!query) return localMembers;

    return localMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, localMembers]);

  async function handleAdd(member: Collaborator) {
    if (pending.includes(member._id) || member.added) return;

    setPending((p) => [...p, member._id]);

    try {
      await onAdd(member);

      setLocalMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, added: true } : m)),
      );
    } finally {
      setPending((p) => p.filter((id) => id !== member._id));
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Add Members</h3>
          <p className="text-sm text-muted-foreground">
            Invite people you've collaborated with before.
          </p>
        </div>

        <div className="rounded bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-500">
          {filtered.length} collaborators
        </div>
      </div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collaborators..."
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>

          <h3 className="font-semibold">No collaborators found</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            People you've collaborated with will appear here.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((member) => {
            const isLoading = pending.includes(member._id);

            return (
              <div
                key={member._id}
                className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={
                        member.image ||
                        `https://ui-avatars.com/api/?name=${member.name}`
                      }
                      alt={member.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  </Avatar>

                  <div>
                    <p className="font-medium">{member.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  disabled={member.added || isLoading}
                  onClick={() => handleAdd(member)}
                >
                  {member.added ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {isLoading ? "Adding..." : "Add"}
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
