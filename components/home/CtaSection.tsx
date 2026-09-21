"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function CtaSection() {
  const { user, is404 } = useAuth();

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto overflow-hidden">
      <div className="relative rounded-lg p-8 sm:p-12 md:p-14 bg-[#f8f8f8] dark:bg-[#252526] border border-[#cecece] dark:border-[#333333] shadow-sm text-center overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md text-xs font-semibold bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get Started in Under 30 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1e1e] dark:text-white tracking-tight leading-tight">
            Ready to Supercharge Your Coding Workflow?
          </h2>

          <p className="text-base sm:text-lg text-[#616161] dark:text-[#9d9d9d] max-w-xl mx-auto font-normal leading-relaxed">
            Join thousands of developers, teams, and students coding together in real time.
            Experience the future of pair programming today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href={user && !is404 ? "/dashboard" : "/auth/signup"}>
              <Button className="h-11 px-7 rounded-md font-medium text-white bg-[#007acc] hover:bg-[#0062a3] shadow-sm transition-colors gap-2 text-sm">
                <span>{user && !is404 ? "Go to Dashboard" : "Start Coding Free"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href={user && !is404 ? "/dashboard" : "/auth/login"}>
              <Button
                variant="outline"
                className="h-11 px-6 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-white dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2d2d2d] transition-colors text-sm font-medium gap-2"
              >
                <Terminal className="w-4 h-4 text-[#007acc] dark:text-[#3794ff]" />
                <span>Open Quick Playground</span>
              </Button>
            </Link>
          </div>

          {/* Reassurance pills */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-[#616161] dark:text-[#9d9d9d]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007acc] dark:text-[#3794ff]" /> Free tier forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007acc] dark:text-[#3794ff]" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007acc] dark:text-[#3794ff]" /> Sub-15ms global sync
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
