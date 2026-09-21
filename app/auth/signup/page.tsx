import { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Shield, Users, Laptop } from "lucide-react";
import AuthHeaderActions from "@/components/auth/AuthHeaderActions";

export const metadata: Metadata = {
  title: "Sign up | CodeSync",
  description: "Create your free CodeSync account and start collaborative coding.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top Floating Navigation */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#07090e]/70 backdrop-blur-xl sticky top-0 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CodeSync</span>
        </Link>

        {/* Theme toggle & logo */}
        <div className="flex items-center gap-3">
          <AuthHeaderActions />
        </div>
      </header>

      {/* Main Split Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Showcase (Desktop Only) */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-slate-100/50 dark:bg-[#0a0d14] border-r border-slate-200 dark:border-white/10 relative overflow-hidden">
          {/* Ambient Lighting & Grid */}
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Developer Setup</span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Start building together in under 30 seconds.
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Create your account to launch instant collaborative coding rooms, match with developers,
              and code with intelligent AI assistance.
            </p>
          </div>

          {/* Value Checklist Card */}
          <div className="relative z-10 space-y-4 my-8">
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#121622] border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Free Forever Tier</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Unlimited public rooms & community matchmaking</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Real-Time Multi-Cursor</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">See your teammates' edits live with zero latency locks</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">In-Browser Sandboxes</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero dependencies required on your local machine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>SOC-2 ready enterprise security & encrypted sessions</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-white dark:bg-[#07090e]">
          <div className="w-full max-w-[440px]">
            <SignupForm />

            <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 space-x-4">
              <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
