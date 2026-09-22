import Link from "next/link";
import { Code2, Home, LayoutDashboard, Terminal, ArrowLeft, Search, Compass, AlertCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found • CodeSync",
  description: "The page or workspace you are looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-[#1e1e1e] text-[#d4d4d4] selection:bg-[#007acc] selection:text-white select-none">
      {/* Background ambient VS Code Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007acc]/10 blur-[140px]" />

      {/* Editor Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Top Mini Header */}
      <header className="relative z-10 flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#007acc] text-white shadow-md shadow-[#007acc]/20">
            <Code2 className="size-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md border border-[#333333] bg-[#252526] px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#2d2d30] hover:text-white transition-colors"
          >
            <LayoutDashboard className="size-3.5 text-[#007acc]" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Center 404 Content */}
      <div className="relative z-10 my-auto flex w-full max-w-2xl flex-col items-center px-4 py-8 text-center">
        {/* Status Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#007acc]/30 bg-[#007acc]/10 px-3.5 py-1 text-xs font-mono font-medium text-[#007acc]">
          <span className="size-2 rounded-full bg-[#007acc] animate-pulse" />
          <span>HTTP 404 • ROUTE_NOT_FOUND</span>
        </div>

        {/* Big Glitch/Code Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono">
          4<span className="text-[#007acc]">0</span>4
        </h1>

        <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#f3f3f3]">
          Page Not Found in Workspace
        </h2>

        <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[#969696]">
          The file, room, or URL you're trying to reach doesn't exist, has been deleted,
          or the path entered is incorrect.
        </p>

        {/* Mini VS Code Mockup Window */}
        <div className="mt-6 w-full max-w-lg overflow-hidden rounded-lg border border-[#2d2d30] bg-[#252526] shadow-2xl shadow-black/80 text-left font-mono">
          {/* Window Header */}
          <div className="flex h-8 items-center justify-between border-b border-[#2d2d30] bg-[#1f1f1f] px-3 select-none">
            {/* Window dots */}
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>

            {/* Tab */}
            <div className="flex items-center gap-1.5 rounded-t bg-[#252526] px-2.5 py-1 text-[11px] text-[#cccccc] border-t border-x border-[#2d2d30]">
              <span className="text-[#007acc] font-bold text-[10px]">TS</span>
              <span>404_NotFound.ts</span>
            </div>

            <div className="w-10" />
          </div>

          {/* Code content */}
          <div className="p-3 text-[11px] sm:text-xs leading-relaxed space-y-1 bg-[#1e1e1e] text-[#cccccc] overflow-x-auto">
            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] select-none w-4 text-right">1</span>
              <span>
                <span className="text-[#569cd6]">import</span> &#123;{" "}
                <span className="text-[#4ec9b0]">Workspace</span> &#125;{" "}
                <span className="text-[#569cd6]">from</span>{" "}
                <span className="text-[#ce9178]">&quot;@codesync/core&quot;</span>;
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] select-none w-4 text-right">2</span>
              <span>
                <span className="text-[#6a9955]">&#47;&#47; Status: Route resolution failed</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] select-none w-4 text-right">3</span>
              <span>
                <span className="text-[#c586c0]">if</span> (!<span className="text-[#9cdcfe]">route</span>.
                <span className="text-[#4ec9b0]">exists</span>) &#123;
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] select-none w-4 text-right">4</span>
              <span className="pl-4">
                <span className="text-[#dcdcaa]">throw</span>{" "}
                <span className="text-[#4ec9b0]">NotFoundError</span>(
                <span className="text-[#ce9178]">&quot;Cannot resolve URL in workspace&quot;</span>);
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] select-none w-4 text-right">5</span>
              <span>&#125;</span>
            </div>
          </div>

          {/* Mini Terminal Error Bar */}
          <div className="flex items-center justify-between border-t border-[#2d2d30] bg-[#181818] px-3 py-1.5 text-[11px] text-[#f14c4c]">
            <div className="flex items-center gap-1.5 truncate">
              <Terminal className="size-3 text-[#f14c4c] shrink-0" />
              <span className="truncate">ERR_ROUTE_NOT_FOUND: target does not exist</span>
            </div>
            <span className="size-1.5 rounded-full bg-[#f14c4c] animate-ping" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[#007acc] px-4 text-xs font-medium text-white shadow-lg shadow-[#007acc]/20 hover:bg-[#006bb3] active:scale-95 transition-all"
          >
            <LayoutDashboard className="size-3.5" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#3c3c3c] bg-[#252526] px-4 text-xs font-medium text-[#cccccc] hover:bg-[#2d2d30] hover:text-white active:scale-95 transition-all"
          >
            <Home className="size-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer Line */}
      <footer className="relative z-10 flex h-9 w-full items-center justify-between border-t border-[#2d2d30] bg-[#181818] px-4 text-[11px] text-[#5a5a5a] font-mono">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[#007acc]" />
          <span>CodeSync Workspace System</span>
        </div>
        <div>
          <span>STATUS: OPERATIONAL</span>
        </div>
      </footer>
    </main>
  );
}
