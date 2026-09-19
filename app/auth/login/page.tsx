import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in | CodeSync",
};

export default function LogInPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0f1115] p-6 md:p-10">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[120px]" />

      {/* Bottom glow */}
      <div className="pointer-events-none absolute bottom-[-250px] left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/[0.035] blur-[100px]" />

      {/* Login content */}
      <div className="relative z-10 flex w-full max-w-[440px] flex-col gap-5">
        {/* Brand */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
              <div className="h-2 w-2 rounded-full bg-indigo-400" />
            </div>

            <span className="text-sm font-semibold tracking-tight text-slate-200">
              codesync
              <span className="text-indigo-400">.</span>
            </span>
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
