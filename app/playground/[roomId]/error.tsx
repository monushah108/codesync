"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, RefreshCw, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(() => {
      reset();
      router.refresh();
    });
  };

  return (
    <main className="relative flex min-h-screen cursor-default items-center justify-center bg-[#1e1e1e] px-4 text-[#cccccc] select-none">
      {/* Centered VS Code Card */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2d2d30] bg-[#252526] p-6 sm:p-8 text-center shadow-2xl shadow-black/60">
        {/* Error icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-inner">
          <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />
        </div>

        {/* Error code pill */}
        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
          <span className="size-1.5 rounded-full bg-red-400" />
          <span>ERROR 500 • WORKSPACE FAILURE</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-white">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-2 text-xs leading-5 text-[#858585]">
          An unexpected error occurred while loading this workspace. You can retry loading or return to your dashboard.
        </p>

        {/* Error details in terminal-like box */}
        {error?.message && (
          <div className="mt-5 rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] p-3 text-left">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#858585]">
              <span className="size-1.5 rounded-full bg-red-400" />
              <span>Diagnostic Details</span>
            </div>

            <p className="max-h-24 overflow-auto break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Button
            onClick={handleRetry}
            disabled={pending}
            className="h-9 flex-1 bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-medium rounded transition-colors"
          >
            {pending ? (
              <>
                <Spinner className="mr-1.5 h-3.5 w-3.5" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Try Again
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-9 flex-1 border-[#3c3c3c] bg-[#1e1e1e] hover:bg-[#2d2d2d] hover:text-white text-[#cccccc] text-xs font-medium rounded transition-colors"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
              Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-9 px-3 border-[#3c3c3c] bg-[#1e1e1e] hover:bg-[#2d2d2d] hover:text-white text-[#cccccc] text-xs font-medium rounded transition-colors"
          >
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[10px] font-mono tracking-wider text-[#5a5a5a]">
          CODESYNC • UNEXPECTED ERROR
        </p>
      </div>
    </main>
  );
}
