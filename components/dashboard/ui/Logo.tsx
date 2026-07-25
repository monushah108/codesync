import { useEffect, useState } from "react";

// --- Typing Logo ---
export function AnimatedLogo() {
  const full = "< Codex />";
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) {
        setDone(true);
        clearInterval(t);
      }
    }, 65);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(t);
  }, [done]);

  return (
    <div
      className="flex items-center select-none"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "1.05rem",
        fontWeight: 500,
      }}
    >
      <span
        style={{
          background:
            "linear-gradient(90deg, #818CF8 0%, #A78BFA 40%, #C4B5FD 70%, #818CF8 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: done ? "gradient-sweep 3s linear infinite" : "none",
        }}
      >
        {text}
      </span>
      <span
        style={{
          color: cursorOn ? "#6366F1" : "transparent",
          marginLeft: "1px",
          fontWeight: 300,
          transition: "color 0.05s",
        }}
      >
        |
      </span>
    </div>
  );
}
