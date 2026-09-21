import Link from "next/link";
import { AlertCircle, Home, LayoutDashboard } from "lucide-react";

export default function NoRoom() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#1e1e1e] px-4 text-[#cccccc] select-none">
      <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2d2d30] bg-[#252526] p-6 sm:p-8 text-center shadow-2xl shadow-black/60">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#007acc]/30 bg-[#007acc]/10 text-[#007acc] shadow-inner">
          <AlertCircle className="h-7 w-7" strokeWidth={1.75} />
        </div>

        {/* Status Pill */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-[#007acc]/10 text-[#007acc] border border-[#007acc]/20">
          <span className="size-1.5 rounded-full bg-[#007acc]" />
          <span>Workspace Unavailable</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-white">
          Room Not Found
        </h1>

        {/* Description */}
        <p className="mt-2 text-xs leading-5 text-[#858585]">
          The workspace you're trying to access doesn't exist, has been deleted, or the room ID in the URL is invalid.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded bg-[#007acc] px-4 text-xs font-medium text-white shadow-xs transition hover:bg-[#0062a3]"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 text-xs font-medium text-[#cccccc] transition hover:bg-[#2a2d2e] hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            Home Page
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[10px] font-mono tracking-wider text-[#5a5a5a]">
          CODESYNC • ROOM 404
        </p>
      </div>
    </main>
  );
}
