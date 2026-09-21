"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Users,
  Terminal,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  Bot,
} from "lucide-react";
import { Button } from "../ui/button";

type PlaygroundMode = "multiplayer" | "copilot" | "sandbox";

export default function Demo() {
  const [mode, setMode] = useState<PlaygroundMode>("multiplayer");
  const [aiAccepted, setAiAccepted] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunningSandbox, setIsRunningSandbox] = useState(false);

  const triggerSandbox = () => {
    setIsRunningSandbox(true);
    setTerminalOutput([
      "Initializing micro-container...",
      "Loading Node.js v20.11 runtime (isolated)",
      "Resolving dependencies via WebAssembly cache...",
    ]);

    setTimeout(() => {
      setTerminalOutput((prev) => [
        ...prev,
        "Running: node main.js",
        "⚡ Output: Server listening on http://localhost:3000",
        "✓ Response time: 4ms | Memory: 14.2MB",
      ]);
      setIsRunningSandbox(false);
    }, 1000);
  };

  return (
    <section id="demo" className="relative px-4 sm:px-6 lg:px-8 py-24 max-w-7xl mx-auto overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[130px] rounded-full -z-10 pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Playground</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Experience CodeSync in Action
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Test real-time multiplayer editing, smart AI pair programming, and instant sandboxed execution.
        </p>
      </div>

      {/* Interactive Playground Window */}
      <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-slate-950/40 overflow-hidden transition-colors">
        {/* Playground Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50 dark:bg-[#090c13] border-b border-slate-200 dark:border-white/10 transition-colors">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 dark:bg-white/[0.06] text-xs font-medium">
            <button
              onClick={() => setMode("multiplayer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === "multiplayer"
                  ? "bg-white dark:bg-[#141a26] text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Multiplayer Cursors</span>
            </button>

            <button
              onClick={() => setMode("copilot")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === "copilot"
                  ? "bg-white dark:bg-[#141a26] text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-500" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => setMode("sandbox")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === "sandbox"
                  ? "bg-white dark:bg-[#141a26] text-slate-900 dark:text-white shadow-sm font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cloud Sandbox</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Room #sandbox-live</span>
          </div>
        </div>

        {/* Playground Content Canvas */}
        <div className="p-6 font-mono text-xs sm:text-sm min-h-[340px] bg-slate-50/50 dark:bg-[#0c1017] text-slate-800 dark:text-slate-200 relative transition-colors">
          <AnimatePresence mode="wait">
            {mode === "multiplayer" && (
              <motion.div
                key="multiplayer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-sans text-slate-500 dark:text-slate-400">
                  <span>Simulating real-time keystrokes between 3 peers</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono font-medium">Sync latency: 9ms</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-slate-400 dark:text-slate-500">// Collaborative document state (Y.Doc)</p>
                  <p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">const</span>{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">room</span> ={" "}
                    <span className="text-cyan-600 dark:text-cyan-400 font-medium">new</span>{" "}
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Y.Doc</span>();
                  </p>
                  <p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">const</span>{" "}
                    <span className="text-slate-800 dark:text-slate-200">codeText</span> = room.
                    <span className="text-blue-600 dark:text-blue-400">getText</span>(
                    <span className="text-emerald-600 dark:text-emerald-400">"editor"</span>);
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    codeText.<span className="text-blue-600 dark:text-blue-400">observe</span>
                    ((event) =&gt; {"{"}
                  </p>
                  <div className="pl-6 border-l-2 border-indigo-500/50">
                    <p className="text-emerald-700 dark:text-emerald-400">
                      console.log("CRDT diff synchronized", event.changes);
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{"});"}</p>
                </div>

                {/* Animated Cursors */}
                <motion.div
                  className="absolute top-28 left-64 flex items-center gap-1 z-10"
                  animate={{ x: [0, 25, 0], y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-0.5 h-4 bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
                  <span className="px-1.5 py-0.5 rounded bg-cyan-600 text-[10px] font-bold text-white font-sans shadow-sm">
                    David (SF)
                  </span>
                </motion.div>

                <motion.div
                  className="absolute top-44 left-44 flex items-center gap-1 z-10"
                  animate={{ x: [0, -20, 0], y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <div className="w-0.5 h-4 bg-pink-500 shadow-[0_0_8px_#ec4899]" />
                  <span className="px-1.5 py-0.5 rounded bg-pink-600 text-[10px] font-bold text-white font-sans shadow-sm">
                    Amina (London)
                  </span>
                </motion.div>
              </motion.div>
            )}

            {mode === "copilot" && (
              <motion.div
                key="copilot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-sans text-slate-500 dark:text-slate-400">
                  <span>AI In-line completion preview</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAiAccepted(!aiAccepted)}
                    className="h-7 text-xs font-sans text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset prompt
                  </Button>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="text-slate-400 dark:text-slate-500">// Prompt: Optimize bubble sort to quicksort algorithm</p>
                  <p>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">function</span>{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">quickSort</span>(
                    <span className="text-slate-700 dark:text-slate-200">arr: number[]</span>):{" "}
                    <span className="text-amber-600 dark:text-amber-400 font-medium">number[]</span> {"{"}
                  </p>
                  <p className="pl-4 text-slate-600 dark:text-slate-400">
                    if (arr.length &lt;= 1) return arr;
                  </p>

                  {/* AI Generated Suggestion */}
                  <div
                    className={`pl-4 transition-all duration-300 ${
                      aiAccepted
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-slate-600 dark:text-slate-400 italic bg-purple-50 dark:bg-purple-500/10 border-l-2 border-purple-500 py-1 pl-3 rounded-r"
                    }`}
                  >
                    <p>const pivot = arr[arr.length - 1];</p>
                    <p>const left = arr.filter((x, i) =&gt; x &lt; pivot);</p>
                    <p>const right = arr.filter((x, i) =&gt; x &gt;= pivot && i &lt; arr.length - 1);</p>
                    <p>return [...quickSort(left), pivot, ...quickSort(right)];</p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{"}"}</p>
                </div>

                {!aiAccepted ? (
                  <div className="mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-purple-800 dark:text-purple-300 font-sans font-medium">
                      ✨ AI Copilot generated O(n log n) sorting implementation
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setAiAccepted(true)}
                      className="h-7 bg-purple-600 hover:bg-purple-700 text-white text-xs font-sans shadow-sm"
                    >
                      Accept Suggestion (Tab ⇥)
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-sans font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Suggestion accepted & added to collaborative tree</span>
                  </div>
                )}
              </motion.div>
            )}

            {mode === "sandbox" && (
              <motion.div
                key="sandbox"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-sans text-slate-500 dark:text-slate-400">
                  <span>Isolated Browser Sandbox (WebContainers / V8)</span>
                  <Button
                    size="sm"
                    onClick={triggerSandbox}
                    disabled={isRunningSandbox}
                    className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs gap-1.5 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunningSandbox ? "Compiling..." : "Execute Sandbox"}</span>
                  </Button>
                </div>

                <div className="bg-slate-900 text-slate-200 dark:bg-[#080b10] rounded-xl p-4 border border-slate-800 font-mono text-xs space-y-1.5 min-h-[160px] shadow-inner">
                  <p className="text-slate-500">// Terminal Output</p>
                  {terminalOutput.length === 0 ? (
                    <p className="text-slate-400 italic">Click "Execute Sandbox" to test instant in-browser compilation.</p>
                  ) : (
                    terminalOutput.map((line, i) => (
                      <p
                        key={i}
                        className={
                          line.includes("Output:")
                            ? "text-emerald-400 font-bold"
                            : line.includes("✓")
                            ? "text-cyan-400"
                            : "text-slate-300"
                        }
                      >
                        {line}
                      </p>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 text-center shadow-sm shadow-slate-900/5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Instant Setup</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Zero installs, zero configurations. Start coding immediately in any modern browser.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 text-center shadow-sm shadow-slate-900/5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">Real-Time Sync</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Conflict-free CRDT data types guarantee rock-solid synchronization across all clients.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 text-center shadow-sm shadow-slate-900/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">AI Assistance</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Multi-model intelligence that understands your collaborative workspace context.
          </p>
        </div>
      </div>
    </section>
  );
}
