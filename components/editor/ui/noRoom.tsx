import Link from "next/link";
import { AlertCircle, Home, Plus } from "lucide-react";

export default function NoRoom() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] px-6 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/5">
          <AlertCircle className="h-8 w-8 text-indigo-400" />
        </div>

        {/* Status */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          Workspace unavailable
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Room not found
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
          The room you're trying to access doesn't exist, has been deleted, or
          you don't have permission to view it.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            href="/playground"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-5 text-sm font-medium text-slate-300 transition hover:border-indigo-500/40 hover:bg-slate-900 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Create Room
          </Link>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.2em] text-slate-700">
          ERROR • ROOM UNAVAILABLE
        </p>
      </div>
    </main>
  );
}
