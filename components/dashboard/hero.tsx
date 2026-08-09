import React from "react";

export default function Hero() {
  return (
    <section className="py-10 sm:py-14">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          Workspace
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Good morning,{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Monu
          </span>
          .
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Pick up where you left off or create a new collaboration room.
        </p>
      </div>
    </section>
  );
}
