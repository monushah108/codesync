"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useCodestore } from "@/lib/store/Codestore";

export default function CtaSection() {
  const user = useCodestore((s) => s.user);

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto overflow-hidden">
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-slate-900 via-[#0e1320] to-[#121626] border border-indigo-500/20 shadow-2xl text-center overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-purple-600/30 blur-[100px] rounded-full pointer-events-none -z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Started in Under 30 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Supercharge Your Coding Workflow?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Join thousands of developers, teams, and students coding together in real time.
            Experience the future of pair programming today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={user ? "/dashboard" : "/auth/signup"}>
              <Button className="h-12 px-8 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2 text-sm">
                <span>{user ? "Go to Dashboard" : "Start Coding Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button
                variant="outline"
                className="h-12 px-6 rounded-xl border-white/15 bg-white/[0.05] text-white hover:bg-white/10 backdrop-blur-sm transition-all text-sm font-medium gap-2"
              >
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Open Quick Playground</span>
              </Button>
            </Link>
          </div>

          {/* Reassurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free tier forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sub-15ms global sync
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
