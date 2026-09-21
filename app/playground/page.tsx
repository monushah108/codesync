import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import heartSvg from "@/public/pixel-heart.gif";
import Form from "@/components/dashboard/form";
import AuthHeaderActions from "@/components/auth/AuthHeaderActions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace | CodeSync",
  description: "Create a room, invite your peers, and code together in real time.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090b11] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors relative overflow-hidden">
      {/* Clean, Elegant Ambient Spotlight Layers */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.22),transparent)] -z-0" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[350px] bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.06),transparent)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent)] -z-0" />

      {/* Top Bar with Navigation & Theme Toggle */}


      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-6">
        {/* Header Pitch */}
        <div className="mb-6 flex shrink-0 flex-col items-center text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Instant Cloud Sandbox</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create a New Workspace
          </h1>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Invite your team and start building together in real time</span>
            <Image
              src={heartSvg}
              alt=""
              width={16}
              height={16}
              unoptimized
              className="select-none"
            />
          </p>
        </div>

        {/* Multi-Step Form */}
        <div className="w-full">
          <Form />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        <div className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Built for developers who code together</span>
        </div>
      </footer>
    </div>
  );
}
