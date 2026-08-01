// app/playground/[id]/loading.tsx

import { Code2, Loader2, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1117] px-6">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_0_80px_rgba(79,70,229,0.15)] backdrop-blur-xl">
        {/* Header */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-500/20 bg-indigo-500/10">
          <Code2 className="h-10 w-10 text-indigo-400" />
        </div>

        <div className="mt-6 text-center">
          <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent">
            Opening Workspace
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Initializing editor, syncing files, and connecting collaborators.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>Loading resources...</span>
            <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/3 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500" />
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Editor Engine</span>
            <span className="text-emerald-400">✓ Ready</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Workspace</span>
            <span className="flex items-center gap-2 text-indigo-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Collaborators</span>
            <span className="text-slate-500">Waiting...</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs tracking-wide text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Preparing your development environment
        </div>
      </div>
    </main>
  );
}
