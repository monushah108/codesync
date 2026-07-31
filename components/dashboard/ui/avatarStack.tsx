import * as Tooltip from "@radix-ui/react-tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

import { useMemberStore } from "@/lib/store/Memberstore";
import { AvatarStackSkeleton } from "../skeletons/avatarSkeleton";
export function AvatarStack({
  roomId,
  isDark,
}: {
  roomId: string;
  isDark: boolean;
}) {
  const members = useMemberStore((s) => s.data[roomId]) || [];

  const show = members.slice(0, 3);
  const extra = members.length - 3;

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="flex items-center cursor-default">
            <AvatarGroup>
              {show.map((member) => (
                <Avatar
                  key={member._id}
                  className="size-7 border-2 border-background shadow-sm"
                >
                  <AvatarImage src={member.image ?? ""} alt={member.name} />
                  <AvatarFallback className="text-[10px]">
                    {member.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}

              {extra > 0 && (
                <AvatarGroupCount className="size-7">+{extra}</AvatarGroupCount>
              )}
            </AvatarGroup>
            {extra > 0 && (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                style={{
                  background: isDark ? "#1E293B" : "#E2E8F0",
                  color: isDark ? "#94A3B8" : "#64748B",
                  marginLeft: "-7px",
                  zIndex: 0,
                  boxShadow: `0 0 0 2px ${isDark ? "#09090B" : "#F8FAFC"}`,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                +{extra}
              </div>
            )}
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={10}
            className="z-50 w-60 rounded-xl border bg-popover p-2 shadow-xl"
          >
            <p className="px-2 pb-2 text-xs font-semibold text-muted-foreground">
              Team Members ({members.length})
            </p>

            <div className="space-y-1">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={member.image ?? ""} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {member.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Tooltip.Arrow className="fill-popover" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
