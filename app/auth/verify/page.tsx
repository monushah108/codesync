import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">


      {/* Center Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none -z-0" />

        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200 dark:border-white/10 p-8 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/40 text-center space-y-6">
          {/* Animated Mail Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 mx-auto">
            <Mail className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Check your email
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We've sent a verification link to your inbox.
            </p>
            {email && (
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
                {email}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 text-left space-y-2">
            <p className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Click the link to verify your CodeSync account
            </p>
            <p className="text-[11px] text-slate-500 pl-6">
              Didn't receive the email? Make sure to check your spam folder or wait a few minutes.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/auth/login">
              <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/25">
                <span>Return to Sign in</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} CodeSync. All rights reserved.
      </footer>
    </div>
  );
}
