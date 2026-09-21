
import Link from "next/link";
import { Code2, Home } from "lucide-react";
import Profile from "../home/ui/profile";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-[#cecece] dark:border-[#333333] pb-5 transition-colors">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#007acc] text-white">
            <Code2 className="h-4 w-4" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#1e1e1e] dark:text-white">
              Code<span className="text-[#007acc]">Sync</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#007acc]/10 text-[#007acc] dark:text-[#3794ff] border border-[#007acc]/20">
              Dashboard
            </span>
          </div>
        </Link>
      </div>

      {/* Right Actions: Home link & Profile */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:text-[#1e1e1e] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2d2e] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        <Profile />
      </div>
    </header>
  );
}
