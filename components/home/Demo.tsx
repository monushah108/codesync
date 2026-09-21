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
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-semibold bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Playground</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1e1e] dark:text-white tracking-tight">
          Experience CodeSync in Action
        </h2>
        <p className="text-base sm:text-lg text-[#616161] dark:text-[#9d9d9d]">
          Test real-time multiplayer editing, smart AI pair programming, and instant sandboxed execution.
        </p>
      </div>

      {/* Interactive Playground Window */}
      <div className="max-w-4xl mx-auto rounded-lg bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-md shadow-black/5 dark:shadow-black/20 overflow-hidden transition-colors">
        {/* Playground Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#f3f3f3] dark:bg-[#1f1f1f] border-b border-[#cecece] dark:border-[#333333] transition-colors">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-md bg-[#e8e8e8] dark:bg-[#181818] border border-[#cecece]/70 dark:border-[#333333] text-xs font-medium">
            <button
              onClick={() => setMode("multiplayer")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                mode === "multiplayer"
                  ? "bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-white shadow-sm font-semibold border border-[#cecece]/80 dark:border-[#3c3c3c]"
                  : "text-[#616161] dark:text-[#9d9d9d] hover:text-[#1e1e1e] dark:hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#007acc]" />
              <span>Multiplayer Cursors</span>
            </button>

            <button
              onClick={() => setMode("copilot")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                mode === "copilot"
                  ? "bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-white shadow-sm font-semibold border border-[#cecece]/80 dark:border-[#3c3c3c]"
                  : "text-[#616161] dark:text-[#9d9d9d] hover:text-[#1e1e1e] dark:hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#007acc] dark:text-[#3794ff]" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => setMode("sandbox")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                mode === "sandbox"
                  ? "bg-white dark:bg-[#252526] text-[#1e1e1e] dark:text-white shadow-sm font-semibold border border-[#cecece]/80 dark:border-[#3c3c3c]"
                  : "text-[#616161] dark:text-[#9d9d9d] hover:text-[#1e1e1e] dark:hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#89d185] dark:text-[#4ec9b0]" />
              <span>Cloud Sandbox</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#616161] dark:text-[#9d9d9d]">
            <span className="w-2 h-2 rounded-full bg-[#89d185]" />
            <span className="font-medium">Room #sandbox-live</span>
          </div>
        </div>

        {/* Playground Content Canvas */}
        <div className="p-6 font-mono text-xs sm:text-sm min-h-[340px] bg-white dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#d4d4d4] relative transition-colors">
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
                <div className="flex items-center justify-between pb-3 border-b border-[#cecece] dark:border-[#333333] text-xs font-sans text-[#616161] dark:text-[#9d9d9d]">
                  <span>Simulating real-time keystrokes between 3 peers</span>
                  <span className="text-[#007acc] dark:text-[#3794ff] font-mono font-medium">Sync latency: 9ms</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <p className="text-[#008000] dark:text-[#6a9955]">// Collaborative document state (Y.Doc)</p>
                  <p>
                    <span className="text-[#0000ff] dark:text-[#569cd6] font-medium">const</span>{" "}
                    <span className="text-[#001080] dark:text-[#9cdcfe] font-medium">room</span> ={" "}
                    <span className="text-[#0000ff] dark:text-[#569cd6] font-medium">new</span>{" "}
                    <span className="text-[#267f99] dark:text-[#4ec9b0] font-medium">Y.Doc</span>();
                  </p>
                  <p>
                    <span className="text-[#0000ff] dark:text-[#569cd6] font-medium">const</span>{" "}
                    <span className="text-[#001080] dark:text-[#9cdcfe]">codeText</span> = room.
                    <span className="text-[#795e26] dark:text-[#dcdcaa]">getText</span>(
                    <span className="text-[#a31515] dark:text-[#ce9178]">"editor"</span>);
                  </p>
                  <p className="text-[#1e1e1e] dark:text-[#cccccc]">
                    codeText.<span className="text-[#795e26] dark:text-[#dcdcaa]">observe</span>
                    ((event) =&gt; {"{"}
                  </p>
                  <div className="pl-6 border-l-2 border-[#007acc]">
                    <p className="text-[#107c41] dark:text-[#89d185]">
                      console.log("CRDT diff synchronized", event.changes);
                    </p>
                  </div>
                  <p className="text-[#1e1e1e] dark:text-[#cccccc]">{"});"}</p>
                </div>

                {/* Animated Cursors */}
                <motion.div
                  className="absolute top-28 left-64 flex items-center gap-1 z-10"
                  animate={{ x: [0, 25, 0], y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-0.5 h-4 bg-[#007acc]" />
                  <span className="px-1.5 py-0.5 rounded bg-[#007acc] text-[10px] font-bold text-white font-sans shadow-sm">
                    David (SF)
                  </span>
                </motion.div>

                <motion.div
                  className="absolute top-44 left-44 flex items-center gap-1 z-10"
                  animate={{ x: [0, -20, 0], y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <div className="w-0.5 h-4 bg-[#c586c0]" />
                  <span className="px-1.5 py-0.5 rounded bg-[#c586c0] text-[10px] font-bold text-white font-sans shadow-sm">
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
                <div className="flex items-center justify-between pb-3 border-b border-[#cecece] dark:border-[#333333] text-xs font-sans text-[#616161] dark:text-[#9d9d9d]">
                  <span>AI In-line completion preview</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAiAccepted(!aiAccepted)}
                    className="h-7 text-xs font-sans text-[#007acc] dark:text-[#3794ff] hover:bg-[#007acc]/10"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset prompt
                  </Button>
                </div>

                <div className="space-y-1 pt-1">
                  <p className="text-[#008000] dark:text-[#6a9955]">// Prompt: Optimize bubble sort to quicksort algorithm</p>
                  <p>
                    <span className="text-[#0000ff] dark:text-[#569cd6] font-medium">function</span>{" "}
                    <span className="text-[#795e26] dark:text-[#dcdcaa] font-medium">quickSort</span>(
                    <span className="text-[#001080] dark:text-[#9cdcfe]">arr</span>: <span className="text-[#267f99] dark:text-[#4ec9b0]">number[]</span>):{" "}
                    <span className="text-[#267f99] dark:text-[#4ec9b0] font-medium">number[]</span> {"{"}
                  </p>
                  <p className="pl-4 text-[#1e1e1e] dark:text-[#cccccc]">
                    if (arr.length &lt;= 1) return arr;
                  </p>

                  {/* AI Generated Suggestion */}
                  <div
                    className={`pl-4 transition-all duration-300 ${
                      aiAccepted
                        ? "text-[#107c41] dark:text-[#89d185]"
                        : "text-[#616161] dark:text-[#9d9d9d] italic bg-[#007acc]/5 dark:bg-[#007acc]/10 border-l-2 border-[#007acc] py-1 pl-3 rounded-r"
                    }`}
                  >
                    <p>const pivot = arr[arr.length - 1];</p>
                    <p>const left = arr.filter((x, i) =&gt; x &lt; pivot);</p>
                    <p>const right = arr.filter((x, i) =&gt; x &gt;= pivot && i &lt; arr.length - 1);</p>
                    <p>return [...quickSort(left), pivot, ...quickSort(right)];</p>
                  </div>
                  <p className="text-[#1e1e1e] dark:text-[#cccccc]">{"}"}</p>
                </div>

                {!aiAccepted ? (
                  <div className="mt-4 p-3 rounded-md bg-[#007acc]/5 dark:bg-[#007acc]/10 border border-[#007acc]/20 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-[#007acc] dark:text-[#3794ff] font-sans font-medium">
                      AI Copilot generated O(n log n) sorting implementation
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setAiAccepted(true)}
                      className="h-7 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-sans shadow-sm"
                    >
                      Accept Suggestion (Tab ⇥)
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 p-3 rounded-md bg-[#89d185]/10 border border-[#89d185]/30 flex items-center gap-2 text-[#107c41] dark:text-[#89d185] text-xs font-sans font-medium">
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
                <div className="flex items-center justify-between pb-3 border-b border-[#cecece] dark:border-[#333333] text-xs font-sans text-[#616161] dark:text-[#9d9d9d]">
                  <span>Isolated Browser Sandbox (WebContainers / V8)</span>
                  <Button
                    size="sm"
                    onClick={triggerSandbox}
                    disabled={isRunningSandbox}
                    className="h-7 bg-[#007acc] hover:bg-[#0062a3] text-white font-mono text-xs gap-1.5 shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunningSandbox ? "Compiling..." : "Execute Sandbox"}</span>
                  </Button>
                </div>

                <div className="bg-[#181818] text-[#cccccc] rounded-md p-4 border border-[#333333] font-mono text-xs space-y-1.5 min-h-[160px]">
                  <p className="text-[#6a9955]">// Terminal Output</p>
                  {terminalOutput.length === 0 ? (
                    <p className="text-[#9d9d9d] italic">Click "Execute Sandbox" to test instant in-browser compilation.</p>
                  ) : (
                    terminalOutput.map((line, i) => (
                      <p
                        key={i}
                        className={
                          line.includes("Output:")
                            ? "text-[#89d185] font-bold"
                            : line.includes("✓")
                            ? "text-[#4ec9b0]"
                            : "text-[#cccccc]"
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
        <div className="p-5 rounded-lg bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] text-center shadow-sm">
          <div className="w-10 h-10 rounded-md bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] mx-auto flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-[#1e1e1e] dark:text-white">Instant Setup</h4>
          <p className="text-xs text-[#616161] dark:text-[#9d9d9d] mt-1 leading-relaxed">
            Zero installs, zero configurations. Start coding immediately in any modern browser.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] text-center shadow-sm">
          <div className="w-10 h-10 rounded-md bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] mx-auto flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-[#1e1e1e] dark:text-white">Real-Time Sync</h4>
          <p className="text-xs text-[#616161] dark:text-[#9d9d9d] mt-1 leading-relaxed">
            Conflict-free CRDT data types guarantee rock-solid synchronization across all clients.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-white dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] text-center shadow-sm">
          <div className="w-10 h-10 rounded-md bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] mx-auto flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-[#1e1e1e] dark:text-white">AI Assistance</h4>
          <p className="text-xs text-[#616161] dark:text-[#9d9d9d] mt-1 leading-relaxed">
            Multi-model intelligence that understands your collaborative workspace context.
          </p>
        </div>
      </div>
    </section>
  );
}
