import { LANG_COLORS } from "@/components/constant/dashboard";

export function LangBadge({ language }: { language: string }) {
  const c = LANG_COLORS[language] ?? {
    bg: "rgba(99,102,241,0.12)",
    text: "#818CF8",
    dot: "#6366F1",
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.dot}28`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: c.dot }}
      />
      {language}
    </span>
  );
}
