"use client";

import { useCallback, useEffect, useState } from "react";
import Greeting from "./ui/greeting";
import { Header } from "./Header";
import { StatsCards } from "./StatsCards";
import { RecentRooms } from "./RecentRooms";
import { FloatingActionButton } from "./FloatingActionButton";
import { CreateRoomModal } from "./model/createRoom";
import { useTheme } from "next-themes";

export interface Member {
  name: string;
  initials: string;
  color: string;
}
export interface Room {
  id: string;
  name: string;
  language: string;
  languageColor: string;
  members: Member[];
  lastOpened: string;
}
export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const s = isDark;

  const handleCreate = useCallback(
    (name: string, language: string, languageColor: string) => {
      setRooms((prev) => [
        {
          id: Date.now().toString(),
          name,
          language,
          languageColor,
          members: [{ name: "Monu", initials: "MO", color: "#6366F1" }],
          lastOpened: "Just now",
        },
        ...prev,
      ]);
      setModalOpen(false);
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <div
      className={isDark ? "dark" : ""}
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', system-ui, sans-serif",
        // Dot-grid background
        backgroundImage: s
          ? "radial-gradient(rgba(99,102,241,0.07) 1px, transparent 1px)"
          : "radial-gradient(rgba(99,102,241,0.1) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        backgroundColor: s ? "#09090B" : "#F8FAFC",
      }}
    >
      {/* Ambient glow orbs */}

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 700,
            height: 700,
            top: -280,
            left: -200,
            background: s ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.04)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            bottom: 0,
            right: -150,
            background: s ? "rgba(139,92,246,0.04)" : "rgba(139,92,246,0.03)",
            filter: "blur(90px)",
          }}
        />
      </div>

      {/* App shell */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Header
          theme={theme}
          onThemeChange={setTheme}
          resolvedTheme={resolvedTheme}
          isDark={isDark}
        />

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Welcome ── */}
          <Greeting setModalOpen={setModalOpen} s={s} />

          {/* ── Stats ── */}
          <StatsCards isDark={isDark} />

          {/* ── Rooms ── */}
          <RecentRooms
            rooms={rooms}
            onDeleteRoom={handleDelete}
            onCreateRoom={() => setModalOpen(true)}
            isDark={isDark}
          />
        </main>
      </div>

      {/* FAB */}
      <FloatingActionButton onClick={() => setModalOpen(true)} />

      {/* Modal */}
      <CreateRoomModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
        isDark={isDark}
      />
    </div>
  );
}

/* TODO : make seprate component from RecentRooms statsCards and theme must be change  */
