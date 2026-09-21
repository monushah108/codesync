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
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1e1e] dark:text-[#ffffff] tracking-tight">
          Engineered for Frictionless Collaboration
        </h2>
        <p className="text-base sm:text-lg text-[#616161] dark:text-[#969696] leading-relaxed">
          Everything your engineering team needs to write, debug, and ship production-ready
          software together without context switching.
        </p>
      </div>

      {/* Bento Grid - Solid VS Code Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Feature 1: Low-latency Multiplayer */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="lg:col-span-2 rounded-lg p-6 bg-[#ffffff] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-center text-[#007acc] mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e1e] dark:text-[#ffffff] mb-1.5">
              Sub-15ms Real-Time Multi-Cursor Sync
            </h3>
            <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] max-w-xl leading-relaxed">
              Powered by state-of-the-art Yjs CRDTs (Conflict-Free Replicated Data Types) and distributed WebSockets.
              Keystrokes synchronize globally with zero lag and zero conflict locks.
            </p>
          </div>

          {/* Mini Preview Card */}
          <div className="mt-5 p-3.5 rounded-md bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] font-mono text-xs text-[#cccccc] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#89d185]" />
              <span className="text-[#1e1e1e] dark:text-[#cccccc] font-sans font-medium">CRDT Mesh: Active</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#858585] font-mono">
              <span className="text-[#89d185] font-semibold">Latency: 11ms</span>
              <span>•</span>
              <span>Conflicts: 0</span>
              <span>•</span>
              <span className="text-[#007acc]">P2P Fallback: Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Feature 2: AI Co-pilot */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="rounded-lg p-6 bg-[#ffffff] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-center text-[#007acc] mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e1e] dark:text-[#ffffff] mb-1.5">
              Autonomous AI Pair Programmer
            </h3>
            <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] leading-relaxed">
              An intelligent co-pilot embedded in your room. Generate code, refactor bottlenecks,
              and resolve compiler errors through inline natural language prompts.
            </p>
          </div>

          <div className="mt-5 p-3 rounded-md bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] text-xs">
            <div className="flex items-center gap-1.5 text-[#007acc] font-medium">
              <Sparkles className="w-3 h-3" />
              <span>Smart Refactoring</span>
            </div>
            <p className="text-[11px] text-[#858585] mt-1 font-mono">
              "Convert sync loop into worker pool"
            </p>
          </div>
        </motion.div>

        {/* Feature 3: Matchmaking & Instant Rooms */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="rounded-lg p-6 bg-[#ffffff] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-center text-[#007acc] mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e1e] dark:text-[#ffffff] mb-1.5">
              1-Click Share & Matchmaking
            </h3>
            <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] leading-relaxed">
              Generate invite links in a click or match with engineers across the world based on
              shared languages and stacks.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-[#858585]">
            <Globe2 className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Over 120 countries represented</span>
          </div>
        </motion.div>

        {/* Feature 4: Secure Real-Time & Isolation */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.15 }}
          className="lg:col-span-2 rounded-lg p-6 bg-[#ffffff] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-xs relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-md bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-center text-[#007acc] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e1e] dark:text-[#ffffff] mb-1.5">
              Isolated Sandboxes & Enterprise-Grade Security
            </h3>
            <p className="text-xs sm:text-sm text-[#616161] dark:text-[#969696] max-w-xl leading-relaxed">
              Every room runs in a secure, containerized environment with end-to-end encrypted transport.
              Granular role-based access controls let you designate Editors, Viewers, and Reviewers.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] text-[#616161] dark:text-[#cccccc] font-medium">
              <CheckCircle className="w-3 h-3 text-[#89d185]" /> E2E TLS Encryption
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] text-[#616161] dark:text-[#cccccc] font-medium">
              <CheckCircle className="w-3 h-3 text-[#89d185]" /> Ephemeral Containers
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f8f8f8] dark:bg-[#1e1e1e] border border-[#cecece] dark:border-[#333333] text-[#616161] dark:text-[#cccccc] font-medium">
              <CheckCircle className="w-3 h-3 text-[#89d185]" /> Role-Based Access
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
