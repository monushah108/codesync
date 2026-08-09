"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
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
    <main className="relative flex min-h-screen cursor-default items-center justify-center overflow-hidden bg-[#0b0d10] px-5 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-lg shadow-red-500/5">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        {/* Error code */}
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-red-400/70">
          ERROR 500
        </p>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
          An unexpected error occurred while loading this page. You can try
          again or return to the home page.
        </p>

        {/* Error details */}
        {error?.message && (
          <div className="mt-6 rounded-xl border border-slate-800 bg-[#111418] p-4 text-left">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
              Error details
            </div>

            <p className="max-h-24 overflow-auto break-words font-mono text-xs leading-5 text-slate-400">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={handleRetry}
            disabled={pending}
            className="h-10 flex-1 bg-red-500 text-white hover:bg-red-400"
          >
            {pending ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-10 flex-1 border-slate-800 bg-[#111418] text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[10px] tracking-wider text-slate-600">
          ORBIT AI • UNEXPECTED ERROR
        </p>
      </div>
    </main>
  );
}
