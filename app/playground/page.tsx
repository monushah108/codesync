import { Binary, Sparkles } from "lucide-react";
import Image from "next/image";

import heartSvg from "@/public/pixel-heart.gif";
import Form from "@/components/dashboard/form";

export default function Page() {
  return (
    <main className="relative flex h-dvh w-full overflow-hidden bg-[#09090b] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[320px] w-[320px] rounded-full bg-violet-600/5 blur-[110px]" />

        <div className="absolute right-[-120px] top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[110px]" />
      </div>

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex shrink-0 flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10">
            <Binary className="h-5 w-5 text-indigo-400" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">
            codex
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              .
            </span>
          </h1>

          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            Create a room. Invite your peers. Code together in real time.
            <Image
              src={heartSvg}
              alt=""
              width={17}
              height={17}
              unoptimized
              className="select-none"
            />
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-[10px] tracking-wide text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            REAL-TIME COLLABORATION
          </div>
        </div>

        {/* Form */}
        <div className="w-full">
          <Form />
        </div>

        {/* Footer */}
        <div className="mt-4 flex shrink-0 items-center gap-1.5 text-[10px] text-slate-600">
          <Sparkles className="h-3 w-3" />
          Built for developers who code together.
        </div>
      </div>
    </main>
  );
}
