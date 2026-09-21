"use client";

import { motion } from "motion/react";
import {
  Users,
  Bot,
  ShieldCheck,
  Zap,
  Share2,
  Terminal,
  Sparkles,
  CheckCircle,
  Cpu,
  Globe2,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Engineered for Frictionless Collaboration
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Everything your engineering team needs to write, debug, and ship production-ready
          software together without context switching.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feature 1: Low-latency Multiplayer (Large - 2 cols on desktop) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 rounded-2xl p-7 bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-950/5 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Sub-15ms Real-Time Multi-Cursor Sync
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Powered by state-of-the-art Yjs CRDTs (Conflict-Free Replicated Data Types) and distributed WebSockets.
              Experience seamless multi-cursor editing where keystrokes synchronize globally with zero lag and zero conflict locks.
            </p>
          </div>

          {/* Mini Interactive Preview Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-[#121824] border border-slate-200/80 dark:border-white/[0.08] font-mono text-xs text-slate-300 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-sans font-medium">CRDT Mesh: Active</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-emerald-500 font-semibold">Latency: 11ms</span>
              <span>•</span>
              <span>Conflicts: 0</span>
              <span>•</span>
              <span className="text-indigo-400">P2P Fallback: Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: AI Co-pilot (1 col on desktop) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl p-7 bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-950/5 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Autonomous AI Pair Programmer
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              An intelligent co-pilot embedded in your room. Generate code, refactor bottlenecks,
              and resolve compiler errors through inline natural language prompts.
            </p>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-[#121824] border border-slate-200/80 dark:border-white/[0.08] text-xs">
            <div className="flex items-center gap-2 text-indigo-500 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Refactoring</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              "Convert sync loop into parallel worker pool"
            </p>
          </div>
        </motion.div>

        {/* Feature 3: Matchmaking & Instant Rooms */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl p-7 bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-950/5 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 group-hover:bg-cyan-500/20 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              1-Click Share & Matchmaking
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate invite links in a click or match with engineers across the world based on
              shared languages and stacks.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Globe2 className="w-4 h-4 text-cyan-500" />
            <span>Over 120 countries represented</span>
          </div>
        </motion.div>

        {/* Feature 4: Secure Real-Time & Isolation (Large - 2 cols on desktop) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 rounded-2xl p-7 bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-950/5 relative overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/20 transition-all duration-500" />
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Isolated Sandboxes & Enterprise-Grade Security
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              Every room runs in a secure, containerized environment with end-to-end encrypted transport.
              Granular role-based access controls let you designate Editors, Viewers, and Reviewers.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> E2E TLS Encryption
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Ephemeral Containers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Role-Based Access
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
