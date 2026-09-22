"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Play,
  Check,
  Copy,
  Sparkles,
  Terminal,
  FileCode,
  Laptop,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { CODE_FILES } from "../constant/main-constant";

import { useRoomStore } from "@/lib/store/Roomstore";

export default function Hero() {
  const { user, is404 } = useAuth();
  const [activeTab, setActiveTab] = useState<"CollabRoom.tsx" | "ai-copilot.py">("CollabRoom.tsx");
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const recentRoom = useRoomStore((s) => s.recentRoom);

  useEffect(() => {
    setMounted(true);
  }, []);



  const handleRunCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  const currentSnippet = CODE_FILES[activeTab];

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-7">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mounted && recentRoom?._id ? (
              <Link
                href={`/playground/${recentRoom._id}`}
                className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-md bg-[#007acc]/10 border border-[#007acc]/30 text-[#007acc] dark:text-[#3794ff] shadow-xs hover:bg-[#007acc]/15 transition-colors group cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007acc] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007acc]" />
                </span>
                <span className="text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc]">
                  Recent Workspace:{" "}
                  <strong className="text-[#007acc] dark:text-[#3794ff] font-semibold">
                    {recentRoom.name}
                  </strong>
                </span>
                <span className="inline-flex items-center text-xs font-medium text-[#007acc] dark:text-[#3794ff] group-hover:translate-x-0.5 transition-transform">
                  Resume →
                </span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-md bg-[#f0f0f0] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89d185]" />
                </span>
                <span className="text-xs font-medium text-[#616161] dark:text-[#cccccc]">
                  CodeSync 2.0 with sub-15ms CRDT synchronization
                </span>
                <span className="inline-flex items-center text-xs font-medium text-[#007acc] hover:underline">
                  See what's new →
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#1e1e1e] dark:text-[#ffffff] leading-[1.1] md:leading-[1.1]"
          >
            Where Developers Code,{" "}
            <span className="text-[#007acc] dark:text-[#3794ff]">
              Collaborate & Ship
            </span>{" "}
            in Real Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-base sm:text-lg text-[#616161] dark:text-[#969696] max-w-2xl mx-auto font-normal leading-relaxed"
          >
            The collaborative IDE built for engineering teams. Pair program with teammates worldwide,
            harness intelligent AI co-pilots, and run sandboxed code in zero-latency browser rooms.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2 w-full max-w-xl mx-auto"
          >
            {mounted && recentRoom?._id ? (
              <>
                <Link
                  href={`/playground/${recentRoom._id}`}
                  className="flex-1 sm:flex-initial"
                >
                  <Button className="w-full sm:w-auto h-9 sm:h-10 px-3.5 sm:px-5 rounded-md font-medium text-white bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] transition-colors gap-2 text-xs sm:text-sm shadow-sm whitespace-nowrap group">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="max-w-[140px] sm:max-w-[200px] truncate">
                      Open {recentRoom.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>

                <Link href={user && !is404 ? "/dashboard" : "/auth/signup"} className="flex-1 sm:flex-initial" > <Button variant="outline" className=" w-full sm:w-auto h-10 px-3.5 sm:px-4 rounded-lg border-[#cecece] dark:border-[#3c3c3c] bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#f5f5f5] dark:hover:bg-[#2d2d2d] hover:border-[#b8b8b8] dark:hover:border-[#4a4a4a] transition-all duration-200 gap-2 text-xs sm:text-sm font-medium shadow-none whitespace-nowrap " > <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#007acc]/10"> <Laptop className="w-3 h-3 text-[#007acc]" /> </span> <span> {user && !is404 ? "Dashboard" : "Start Coding Free"} </span> </Button> </Link>

                <a href="#demo" className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-9 sm:h-10 px-2.5 sm:px-4 rounded-md border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] text-[#616161] dark:text-[#cccccc] hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] transition-colors gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium shadow-none whitespace-nowrap"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#007acc] shrink-0" />
                    <span>Interactive Demo</span>
                  </Button>
                </a>
              </>
            ) : (
              <>
                <Link
                  href={user && !is404 ? "/dashboard" : "/auth/signup"}
                  className="flex-1 sm:flex-initial"
                >
                  <Button className="w-full sm:w-auto h-9 sm:h-10 px-3 sm:px-6 rounded-md font-medium text-white bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] transition-colors gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-none whitespace-nowrap">
                    <span>{user && !is404 ? "Go to Dashboard" : "Start Coding Free"}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  </Button>
                </Link>

                <a href="#demo" className="flex-1 sm:flex-initial">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-9 sm:h-10 px-2.5 sm:px-5 rounded-md border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#252526] text-[#1e1e1e] dark:text-[#cccccc] hover:bg-[#f0f0f0] dark:hover:bg-[#2d2d2d] transition-colors gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium shadow-none whitespace-nowrap"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#007acc] shrink-0" />
                    <span>Interactive Demo</span>
                  </Button>
                </a>
              </>
            )}
          </motion.div>

          {/* Trust Metrics Pill Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 max-w-3xl mx-auto border-t border-[#cecece] dark:border-[#333333]"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1e1e1e] dark:text-[#ffffff]">50K+</div>
              <div className="text-xs text-[#616161] dark:text-[#969696]">Active Developers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#89d185]">&lt;15ms</div>
              <div className="text-xs text-[#616161] dark:text-[#969696]">CRDT Sync Latency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#007acc]">1M+</div>
              <div className="text-xs text-[#616161] dark:text-[#969696]">Collab Sessions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[#1e1e1e] dark:text-[#ffffff]">99.99%</div>
              <div className="text-xs text-[#616161] dark:text-[#969696]">Uptime SLA</div>
            </div>
          </motion.div>
        </div>

        {/* Core Interactive Multiplayer IDE Showcase - Authentic VS Code Window */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 relative max-w-5xl mx-auto"
        >
          {/* IDE Window Frame */}
          <div className="rounded-lg bg-[#ffffff] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] shadow-md overflow-hidden text-[#1e1e1e] dark:text-[#cccccc] font-sans transition-colors">
            {/* Window Header / Tab Bar - Classic VS Code Title & Tabs */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#f8f8f8] dark:bg-[#252526] border-b border-[#cecece] dark:border-[#333333] transition-colors">
              {/* macOS Traffic Lights + Active File Tabs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 pr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f25f58]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fbbe3c]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#57c741]" />
                </div>

                {/* File Tabs */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("CollabRoom.tsx")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-colors ${activeTab === "CollabRoom.tsx"
                      ? "bg-[#ffffff] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#ffffff] border-t-2 border-t-[#007acc] border-x border-[#cecece] dark:border-[#333333] font-medium"
                      : "text-[#858585] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#ececec] dark:hover:bg-[#2a2d2e]"
                      }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#007acc]" />
                    <span>CollabRoom.tsx</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007acc]" />
                  </button>

                  <button
                    onClick={() => setActiveTab("ai-copilot.py")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-colors ${activeTab === "ai-copilot.py"
                      ? "bg-[#ffffff] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#ffffff] border-t-2 border-t-[#007acc] border-x border-[#cecece] dark:border-[#333333] font-medium"
                      : "text-[#858585] hover:text-[#1e1e1e] dark:hover:text-[#ffffff] hover:bg-[#ececec] dark:hover:bg-[#2a2d2e]"
                      }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-[#89d185]" />
                    <span>ai-copilot.py</span>
                  </button>
                </div>
              </div>

              {/* Connected Peer Avatars & Controls */}
              <div className="flex items-center gap-2.5">
                {/* Active Collaborators Pill */}
                <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#1f1f1f] text-xs">
                  <div className="flex -space-x-1">
                    <div className="w-4.5 h-4.5 rounded-full bg-[#007acc] flex items-center justify-center text-[9px] font-bold text-white" title="Sarah (Lead)">
                      S
                    </div>
                    <div className="w-4.5 h-4.5 rounded-full bg-[#89d185] flex items-center justify-center text-[9px] font-bold text-[#1e1e1e]" title="Alex (Frontend)">
                      A
                    </div>
                  </div>
                  <span className="text-[10px] text-[#616161] dark:text-[#969696]">3 online</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#89d185]" />
                </div>

                {/* Run Button */}
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="h-6.5 px-2.5 rounded bg-[#007acc] hover:bg-[#0062a3] text-white font-mono text-[11px] gap-1 shadow-none transition-colors"
                >
                  {isRunning ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-2.5 h-2.5 fill-current" />
                  )}
                  <span>{isRunning ? "Running..." : "Run"}</span>
                </Button>
              </div>
            </div>

            {/* Code Body Area with Multi-Cursor Simulation */}
            <div className="relative p-5 font-mono text-xs sm:text-sm overflow-x-auto min-h-[340px] bg-[#ffffff] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#cccccc] transition-colors">
              {/* Line items */}
              <div className="space-y-1">
                {currentSnippet.code.map((line) => (
                  <div key={line.num} className="relative flex items-center group">
                    <span className="w-8 select-none text-right pr-3 text-[#858585] transition-colors">
                      {line.num}
                    </span>
                    <div className="flex-1 flex flex-wrap items-center">
                      {line.tokens.map((tok, i) => (
                        <span key={i} className={tok.color}>
                          {tok.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Simulated Peer Cursor 1: Sarah (Cyan) */}
              <motion.div
                className="absolute top-[138px] left-[260px] pointer-events-none hidden sm:flex items-center gap-1 z-20"
                animate={{
                  x: [0, 18, 0],
                  y: [0, 4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-0.5 h-5 bg-[#007acc]" />
                <div className="px-1 py-0.2 rounded bg-[#007acc] text-white font-medium text-[9px] font-sans">
                  <span>Sarah</span>
                </div>
              </motion.div>

              {/* Simulated Peer Cursor 2: Alex (Purple) */}
              <motion.div
                className="absolute top-[230px] left-[340px] pointer-events-none hidden sm:flex items-center gap-1 z-20"
                animate={{
                  x: [0, -12, 0],
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="w-0.5 h-5 bg-[#c586c0]" />
                <div className="px-1 py-0.2 rounded bg-[#c586c0] text-white font-medium text-[9px] font-sans">
                  Alex
                </div>
              </motion.div>

              {/* Simulated AI Inline Copilot Suggestion Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute bottom-5 right-5 max-w-sm rounded-md bg-[#ffffff] dark:bg-[#252526] border border-[#007acc]/40 p-3 shadow-lg hidden md:block"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#cecece] dark:border-[#333333]">
                  <div className="flex items-center gap-2">
                    <div className="w-4.5 h-4.5 rounded bg-[#007acc]/10 border border-[#007acc]/30 flex items-center justify-center text-[#007acc]">
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-xs font-semibold text-[#1e1e1e] dark:text-[#ffffff]">CodeSync Copilot</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
                    Tab ⇥ to accept
                  </span>
                </div>
                <p className="text-xs text-[#616161] dark:text-[#cccccc] mt-2 leading-relaxed font-sans">
                  Refactored CRDT sync layer to optimize network packet size by <span className="text-[#89d185] font-semibold">42%</span>.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#858585] font-sans">
                  <span className="inline-flex items-center gap-1 text-[#89d185]">
                    <CheckCircle2 className="w-3 h-3" /> All unit tests passing
                  </span>
                  <span>12ms</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive Terminal Drawer - VS Code Terminal Style */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#181818] text-[#cccccc] border-t border-[#333333] px-4 py-2.5 font-mono text-xs shadow-inner"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#333333] text-[#858585] text-[11px]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#007acc]" />
                      <span className="text-[#ffffff] font-medium">Terminal • codesync-sandbox</span>
                    </div>
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="hover:text-[#ffffff] transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mt-2 space-y-1 text-[#cccccc] text-[11px]">
                    <p className="text-[#858585]">$ codesync-runner --env=isolated-v8</p>
                    <p className="text-[#9cdcfe]">✓ Connected to mesh: wss://collab.codesync.dev/room-409</p>
                    <p className="text-[#89d185]">✓ Yjs CRDT synchronized across 3 active peers (11ms RTT)</p>
                    <p className="text-[#c586c0]">✓ AI suggestion accepted by Sarah: bundle optimization</p>
                    <p className="text-[#89d185] font-medium">🚀 Server listening on http://localhost:3000 (0 errors, 0 warnings)</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
