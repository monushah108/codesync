import { useCodestore } from "@/lib/store/Codestore";
import CreateRoomButton from "./roomBtn";
import { motion } from "framer-motion";

export default function Greeting({ setModalOpen, s }) {
  function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  }

  const user = useCodestore((s) => s.user);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
      className="pt-12 pb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.38, delay: 0.12 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            lineHeight: 1.12,
            color: s ? "#F8FAFC" : "#0F172A",
            marginBottom: "0.5rem",
          }}
        >
          {getGreeting()} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.38, delay: 0.18 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
            color: s ? "rgba(248,250,252,0.65)" : "rgba(15,23,42,0.6)",
            marginBottom: "0.6rem",
          }}
        >
          Welcome back, {user?.name}.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="text-sm max-w-sm"
          style={{ color: s ? "#475569" : "#94A3B8", lineHeight: 1.65 }}
        >
          Continue collaborating with your team or create a new coding
          workspace.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.38, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <CreateRoomButton onClick={() => setModalOpen(true)} />
      </motion.div>
    </motion.section>
  );
}
