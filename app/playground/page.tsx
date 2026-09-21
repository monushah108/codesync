import { ArrowLeft, Code2, Sparkles, Terminal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import heartSvg from "@/public/pixel-heart.gif";
import Form from "@/components/dashboard/form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace",
  description: "Create a room, invite your peers, and code together in real time.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#cccccc] flex flex-col justify-between transition-colors relative selection:bg-[#007acc] selection:text-white">
      {/* VS Code Window Titlebar / Navigation Header */}
      <header className="border-b border-[#cecece] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1f1f1f] px-4 py-2 flex items-center justify-between transition-colors">
        {/* Left: Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Center: Brand Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <div className="flex h-5.5 w-5.5 items-center justify-center rounded bg-[#007acc] text-white">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-[#1e1e1e] dark:text-white">
            Code<span className="text-[#007acc]">Sync</span>
          </span>
          <span className="text-[#858585]">/</span>
          <span className="text-[#616161] dark:text-[#9d9d9d] font-mono">new-workspace.ts</span>
        </div>

        {/* Right: Quick Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors"
        >
          <span>Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6">
        {/* Header Pitch */}
        <div className="mb-6 flex shrink-0 flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#89d185]" />
            <span>Instant Cloud Sandbox</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1e1e1e] dark:text-white">
            Create a New Workspace
          </h1>

          <p className="flex items-center justify-center gap-1.5 text-xs text-[#616161] dark:text-[#9d9d9d]">
            <span>Invite your team and start building together in real time</span>
            <Image
              src={heartSvg}
              alt=""
              width={16}
              height={16}
              unoptimized
              className="select-none inline-block"
            />
          </p>
        </div>

        {/* Multi-Step Form */}
        <div className="w-full">
          <Form />
        </div>
      </main>

      {/* VS Code Status Bar Footer */}
      <footer className="w-full border-t border-[#cecece] dark:border-[#333333] bg-[#ffffff] dark:bg-[#181818] py-1.5 px-4 text-xs text-[#616161] dark:text-[#858585] flex flex-wrap items-center justify-between gap-2 transition-colors">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#007acc] dark:text-[#3794ff]" />
          <span className="font-mono text-[11px]">CodeSync Engine v2.0</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Sparkles className="h-3 w-3 text-[#007acc] dark:text-[#3794ff]" />
          <span>Built for developers who code together</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#107c41] dark:text-[#89d185]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#89d185]" />
          <span>WebContainers Ready</span>
        </div>
      </footer>
    </div>
  );
}
