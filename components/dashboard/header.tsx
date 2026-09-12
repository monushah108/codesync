import React from "react";

import Link from "next/link";
import { Binary } from "lucide-react";
import ProfileView from "../editor/ui/profileView";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800/70 pb-5">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
          <Binary className="h-4 w-4 text-indigo-400" />
        </div>

        <span className="text-lg font-bold tracking-tight">
          codesync
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            .
          </span>
        </span>
      </Link>

      <ProfileView />
    </header>
  );
}
