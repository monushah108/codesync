"use client";

import { memo } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Globe, Lock, RefreshCw, Terminal, X } from "lucide-react";

const PreviewSkeleton = memo(function PreviewSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#181818] select-none font-sans">
      {/* 1. Preview Header */}
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-xs">Preview</span>

          {/* Running badge placeholder */}
          <span className="flex items-center gap-1.5 rounded-sm bg-[#1e1e1e] border border-[#333333] px-2 py-0.5 text-[10px] text-[#858585]">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px]">Starting</span>
          </span>

          <span className="hidden sm:inline-flex items-center rounded border border-[#3c3c3c] bg-[#1e1e1e] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#9d9d9d]">
            SANDBOX
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 opacity-60">
          <div className="size-6 rounded-sm bg-[#303033] animate-pulse" />
          <div className="size-6 rounded-sm bg-[#303033] animate-pulse" />
          <div className="size-6 rounded-sm bg-[#303033] animate-pulse" />
          <div className="h-3 w-px bg-[#2d2d30] mx-0.5" />
          <div className="size-6 rounded-sm bg-[#303033] animate-pulse" />
        </div>
      </div>

      {/* 2. Realistic Browser Navigation Bar */}
      <div className="flex h-9 shrink-0 items-center gap-1.5 border-b border-[#2d2d30] bg-[#1f1f1f] px-2 text-[#858585]">
        <div className="flex items-center gap-1 opacity-50">
          <ArrowLeft className="size-3.5" />
          <ArrowRight className="size-3.5" />
          <RefreshCw className="size-3.5 animate-spin" />
        </div>

        {/* Address Bar */}
        <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded border border-[#333333] bg-[#181818] px-2.5 text-[11px] text-[#858585]">
          <Lock className="size-2.5 text-emerald-400" />
          <span className="font-mono text-[10px] text-[#858585]">http://localhost:3000/</span>
          <div className="ml-auto size-2.5 rounded-full bg-[#007acc] animate-pulse" />
        </div>

        <div className="opacity-50">
          <ExternalLink className="size-3.5" />
        </div>
      </div>

      {/* 3. Modern Web Viewport Wireframe Skeleton */}
      <div className="relative flex-1 min-h-0 bg-[#0f0f11] p-4 sm:p-6 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-xl space-y-5 animate-pulse">
          {/* Wireframe Navbar */}
          <div className="flex items-center justify-between border-b border-[#252528] pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-md bg-[#25252a]" />
              <div className="h-3 w-20 rounded bg-[#25252a]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-12 rounded bg-[#202024]" />
              <div className="h-2.5 w-12 rounded bg-[#202024]" />
              <div className="size-6 rounded-full bg-[#25252a]" />
            </div>
          </div>

          {/* Wireframe Hero Section */}
          <div className="pt-2 flex flex-col items-center text-center space-y-3">
            <div className="h-4 w-28 rounded-full bg-[#007acc]/15 border border-[#007acc]/30" />
            <div className="h-6 w-3/4 max-w-xs rounded-md bg-[#2a2a30]" />
            <div className="h-3 w-5/6 max-w-sm rounded bg-[#202024]" />
            <div className="flex items-center gap-2 pt-2">
              <div className="h-7 w-24 rounded-md bg-[#007acc]/40" />
              <div className="h-7 w-20 rounded-md bg-[#202024]" />
            </div>
          </div>

          {/* Wireframe Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div className="rounded-lg border border-[#232328] bg-[#16161a] p-3.5 space-y-2">
              <div className="size-7 rounded-md bg-[#25252a]" />
              <div className="h-3 w-28 rounded bg-[#2a2a30]" />
              <div className="h-2 w-full rounded bg-[#202024]" />
              <div className="h-2 w-3/4 rounded bg-[#202024]" />
            </div>

            <div className="rounded-lg border border-[#232328] bg-[#16161a] p-3.5 space-y-2">
              <div className="size-7 rounded-md bg-[#25252a]" />
              <div className="h-3 w-24 rounded bg-[#2a2a30]" />
              <div className="h-2 w-full rounded bg-[#202024]" />
              <div className="h-2 w-4/5 rounded bg-[#202024]" />
            </div>
          </div>
        </div>

        {/* Compiling Status Pill */}
        <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
          <div className="flex items-center gap-2 rounded-full border border-[#333333] bg-[#1e1e1e]/90 backdrop-blur-xs px-3.5 py-1.5 text-[11px] text-[#cccccc] shadow-lg">
            <Globe className="size-3 text-[#007acc] animate-spin" />
            <span>Building sandbox preview...</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PreviewSkeleton;
