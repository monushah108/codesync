import * as Tooltip from "@radix-ui/react-tooltip";
import { Room } from "../dashboard";
export function AvatarStack({
  members,
  isDark,
}: {
  members: Room["members"];
  isDark: boolean;
}) {
  const show = members.slice(0, 3);
  const extra = members.length - 3;
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="flex items-center cursor-default">
            {show.map((m, i) => (
              <div
                key={m.name + i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                style={{
                  background: m.color,
                  marginLeft: i > 0 ? "-7px" : 0,
                  zIndex: show.length - i,
                  boxShadow: `0 0 0 2px ${isDark ? "#09090B" : "#F8FAFC"}`,
                }}
              >
                {m.initials}
              </div>
            ))}
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
            className="z-50 rounded-xl px-3 py-2.5 text-xs"
            sideOffset={8}
            style={{
              background: isDark ? "rgba(15,23,42,0.96)" : "#fff",
              border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.09)"}`,
              boxShadow: isDark
                ? "0 12px 32px rgba(0,0,0,0.5)"
                : "0 12px 32px rgba(0,0,0,0.1)",
              backdropFilter: "blur(12px)",
              color: isDark ? "#F8FAFC" : "#0F172A",
            }}
          >
            <div className="space-y-1.5">
              {members.map((m) => (
                <div key={m.name} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: m.color }}
                  >
                    {m.initials}
                  </div>
                  <span>{m.name}</span>
                </div>
              ))}
            </div>
            <Tooltip.Arrow
              style={{ fill: isDark ? "rgba(15,23,42,0.96)" : "#fff" }}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
