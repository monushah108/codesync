"use client";

import { useState } from "react";
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
import { useCodestore } from "@/lib/store/Codestore";

type CodeSnippet = {
  fileName: string;
  lang: string;
  code: Array<{
    num: number;
    tokens: Array<{ text: string; color: string }>;
  }>;
};

const CODE_FILES: Record<string, CodeSnippet> = {
  "CollabRoom.tsx": {
    fileName: "CollabRoom.tsx",
    lang: "typescript",
    code: [
      {
        num: 1,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { useMultiplayer, useAI } ", color: "text-slate-800 dark:text-slate-200" },
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: ' "@codesync/core"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ";", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { Editor } ", color: "text-slate-800 dark:text-slate-200" },
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: ' "@codesync/monaco"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ";", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 3,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 4,
        tokens: [
          { text: "export default function", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " LiveWorkspace", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: "({ roomId }: { roomId: ", color: "text-slate-800 dark:text-slate-200" },
          { text: "string", color: "text-amber-600 dark:text-amber-400" },
          { text: " }) {", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  const", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { peers, syncStatus } = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "useMultiplayer", color: "text-cyan-600 dark:text-cyan-400 font-medium" },
          { text: "(roomId);", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  const", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " { copilotSuggest } = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "useAI", color: "text-indigo-600 dark:text-indigo-400 font-medium" },
          { text: "({ model: ", color: "text-slate-800 dark:text-slate-200" },
          { text: '"claude-3.5-sonnet"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: " });", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 7,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 8,
        tokens: [
          { text: "  return", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " (", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "    <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.SyncRoom", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " presence=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{peers}", color: "text-amber-600 dark:text-amber-300" },
          { text: " latency=", color: "text-purple-600 dark:text-purple-300" },
          { text: '"<15ms"', color: "text-emerald-600 dark:text-emerald-400" },
          { text: ">", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "      <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.MultiCursor", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " showNametags=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{true}", color: "text-amber-600 dark:text-amber-400" },
          { text: " />", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "      <", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.InlineAI", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: " onTabAccept=", color: "text-purple-600 dark:text-purple-300" },
          { text: "{copilotSuggest}", color: "text-indigo-600 dark:text-indigo-300" },
          { text: " />", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 12,
        tokens: [
          { text: "    </", color: "text-slate-500 dark:text-slate-400" },
          { text: "Editor.SyncRoom", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: ">", color: "text-slate-500 dark:text-slate-400" },
        ],
      },
      {
        num: 13,
        tokens: [
          { text: "  );", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 14,
        tokens: [
          { text: "}", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
    ],
  },
  "ai-copilot.py": {
    fileName: "ai-copilot.py",
    lang: "python",
    code: [
      {
        num: 1,
        tokens: [
          { text: "from", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " codesync.agents ", color: "text-slate-800 dark:text-slate-200" },
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " PairProgrammer", color: "text-blue-600 dark:text-blue-400 font-medium" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " asyncio, websockets", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 3,
        tokens: [{ text: "", color: "text-transparent" }],
      },
      {
        num: 4,
        tokens: [
          { text: "async def", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " orchestrate_pairing", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: "(session_id: ", color: "text-slate-800 dark:text-slate-200" },
          { text: "str", color: "text-amber-600 dark:text-amber-400" },
          { text: "):", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "    agent = ", color: "text-slate-800 dark:text-slate-200" },
          { text: "PairProgrammer", color: "text-cyan-600 dark:text-cyan-400 font-medium" },
          { text: '(name="CodeSync-AI", mode="autonomous")', color: "text-emerald-600 dark:text-emerald-400" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "    await", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " agent.connect_crdt_mesh(session_id)", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "    print", color: "text-blue-600 dark:text-blue-400 font-medium" },
          { text: '("✓ AI Copilot synced to peer room in 8ms")', color: "text-emerald-600 dark:text-emerald-400" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "    return", color: "text-purple-600 dark:text-purple-400 font-medium" },
          { text: " agent.stream_suggestions()", color: "text-slate-800 dark:text-slate-200" },
        ],
      },
    ],
  },
};

export default function Hero() {
  const user = useCodestore((s) => s.user);
  const [activeTab, setActiveTab] = useState<"CollabRoom.tsx" | "ai-copilot.py">("CollabRoom.tsx");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText("npx codesync-room create --instant");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setShowTerminal(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1200);
  };

  const currentSnippet = CODE_FILES[activeTab];

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Decorative Grids and Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Radial Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:via-blue-500/15 dark:to-purple-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-20 w-[400px] h-[350px] bg-violet-500/10 blur-[120px] rounded-full" />

        {/* High-tech Matrix Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_20%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm hover:border-indigo-500/40 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              CodeSync 2.0 is live with sub-15ms CRDT synchronization
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              See what's new →
            </span>
          </motion.div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] md:leading-[1.1]"
          >
            Where Developers Code,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
              Collaborate & Ship
            </span>{" "}
            in Real Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            The next-generation collaborative IDE. Pair program with teammates worldwide,
            harness intelligent AI co-pilots, and run sandboxed code in zero-latency browser rooms.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Link href={user ? "/dashboard" : "/auth/signup"}>
              <Button className="h-12 px-7 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 gap-2 text-sm">
                <span>{user ? "Go to Dashboard" : "Start Coding Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <a href="#demo">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/[0.04] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm shadow-slate-900/5 backdrop-blur-sm transition-all gap-2 text-sm font-medium"
              >
                <Play className="w-4 h-4 fill-current text-indigo-600 dark:text-indigo-400" />
                <span>Interactive Demo</span>
              </Button>
            </a>

            {/* Quick Copy Room Terminal Pill */}
            <div className="hidden lg:flex items-center gap-2 pl-2 text-xs font-mono bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">$</span>
              <span>npx codesync-room</span>
              <button
                type="button"
                onClick={handleCopyCmd}
                title="Copy room command"
                className="ml-1 p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Trust Metrics Pill Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 max-w-3xl mx-auto border-t border-slate-200 dark:border-white/10"
          >
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">50K+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Active Developers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">&lt;15ms</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">CRDT Sync Latency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">1M+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Collab Sessions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">99.99%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Uptime SLA</div>
            </div>
          </motion.div>
        </div>

        {/* Core Interactive Multiplayer IDE Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-14 relative max-w-5xl mx-auto"
        >
          {/* Ambient Glow behind Editor */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-15 dark:opacity-25 blur-xl -z-10 group-hover:opacity-35 transition-opacity" />

          {/* IDE Window Frame */}
          <div className="rounded-2xl bg-white dark:bg-[#0e121b] border border-slate-200 dark:border-slate-700/60 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/60 overflow-hidden text-slate-800 dark:text-slate-200 font-sans transition-colors">
            {/* Window Header / Tab Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/90 dark:bg-[#0a0d14] border-b border-slate-200 dark:border-slate-800/80 transition-colors">
              {/* macOS Traffic Lights + Active File Tabs */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90 hover:opacity-100 transition-opacity" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90 hover:opacity-100 transition-opacity" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90 hover:opacity-100 transition-opacity" />
                </div>

                {/* File Tabs */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab("CollabRoom.tsx")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      activeTab === "CollabRoom.tsx"
                        ? "bg-white dark:bg-[#141a26] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/60 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>CollabRoom.tsx</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  </button>

                  <button
                    onClick={() => setActiveTab("ai-copilot.py")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      activeTab === "ai-copilot.py"
                        ? "bg-white dark:bg-[#141a26] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/60 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>ai-copilot.py</span>
                  </button>
                </div>
              </div>

              {/* Connected Peer Avatars & Controls */}
              <div className="flex items-center gap-3">
                {/* Active Collaborators Pill */}
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 border border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Sarah (Lead)">
                      S
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Alex (Frontend)">
                      A
                    </div>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 border border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="CodeSync AI">
                      🤖
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">3 online</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Run Button */}
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                  {isRunning ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  <span>{isRunning ? "Running..." : "Run"}</span>
                </Button>
              </div>
            </div>

            {/* Code Body Area with Multi-Cursor Simulation */}
            <div className="relative p-5 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto min-h-[360px] bg-slate-50/70 dark:bg-[#0c1017] text-slate-800 dark:text-slate-200 transition-colors">
              {/* Line items */}
              <div className="space-y-1">
                {currentSnippet.code.map((line) => (
                  <div key={line.num} className="relative flex items-center group">
                    <span className="w-9 select-none text-right pr-4 text-slate-400 dark:text-slate-600 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
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
                <div className="w-0.5 h-5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="px-1.5 py-0.5 rounded bg-cyan-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1 font-sans">
                  <span>Sarah</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
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
                <div className="w-0.5 h-5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <div className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-bold text-[10px] shadow-md font-sans">
                  Alex
                </div>
              </motion.div>

              {/* Simulated AI Inline Copilot Suggestion Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-5 right-5 max-w-sm rounded-xl bg-white/95 dark:bg-[#141a26]/95 border border-indigo-200 dark:border-indigo-500/30 p-3.5 shadow-xl shadow-slate-900/10 dark:shadow-black/50 backdrop-blur-md hidden md:block"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">CodeSync Copilot</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    Tab ⇥ to accept
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-sans">
                  Refactored CRDT sync layer to optimize network packet size by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">42%</span>.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> All unit tests passing
                  </span>
                  <span>12ms inference</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive Terminal Drawer */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900 text-slate-200 dark:bg-[#080a0f] border-t border-slate-200 dark:border-slate-800 px-4 py-3 font-mono text-xs shadow-inner"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-slate-200 font-semibold">CodeSync Runtime Sandbox</span>
                    </div>
                    <button
                      onClick={() => setShowTerminal(false)}
                      className="hover:text-slate-200 transition-colors"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="mt-2 space-y-1 text-slate-300 text-[11px]">
                    <p className="text-slate-500">$ codesync-runner --env=isolated-v8</p>
                    <p className="text-cyan-400">✓ Connected to mesh: wss://collab.codesync.dev/room-409</p>
                    <p className="text-emerald-400">✓ Yjs CRDT synchronized across 3 active peers (11ms RTT)</p>
                    <p className="text-purple-300">✓ AI suggestion accepted by Sarah: bundle optimization</p>
                    <p className="text-emerald-400 font-semibold">🚀 Server listening on http://localhost:3000 (0 errors, 0 warnings)</p>
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
