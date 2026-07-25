import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function CreateRoomButton({ onClick }: { onClick: () => void }) {
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      const id = Date.now();
      setRipples((p) => [
        ...p,
        { id, x: e.clientX - r.left, y: e.clientY - r.top },
      ]);
      setTimeout(() => setRipples((p) => p.filter((rp) => rp.id !== id)), 700);
    }
    onClick();
  };

  return (
    <motion.button
      ref={btnRef}
      onClick={addRipple}
      whileHover={{
        scale: 1.04,
        y: -2,
        boxShadow:
          "0 0 44px rgba(99,102,241,0.65), 0 8px 32px rgba(99,102,241,0.4)",
      }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center gap-2.5 px-6 py-3 rounded-2xl text-white font-semibold text-sm overflow-hidden flex-shrink-0 outline-none"
      style={{
        background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        boxShadow:
          "0 4px 24px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.3)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Inner shine */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)",
        }}
      />
      {/* Ripples */}
      {ripples.map((rp) => (
        <motion.span
          key={rp.id}
          initial={{ scale: 0, opacity: 0.45 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="absolute w-8 h-8 rounded-full pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.35)",
            left: rp.x - 16,
            top: rp.y - 16,
          }}
        />
      ))}
      <Plus size={16} strokeWidth={2.5} className="relative z-10" />
      <span className="relative z-10">Create Room</span>
    </motion.button>
  );
}
