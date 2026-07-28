import notFoundGif from "@/public/notFound.gif";
import Image from "next/image";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1117] px-6">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 max-w-lg text-center">
        <Image
          src={notFoundGif}
          alt="404 Illustration"
          width={260}
          height={260}
          priority
          unoptimized
          className="mx-auto select-none"
        />

        <h1 className="mt-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-6xl font-extrabold text-transparent">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Oops! Page not found
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
          The page you're looking for doesn't exist, may have been moved,
          deleted, or the URL might be incorrect.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Home size={18} />
            Go Home
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
          >
            <Search size={18} />
            Dashboard
          </Link>
        </div>

        <p className="mt-10 text-xs tracking-wider text-slate-500">
          ERROR 404 • RESOURCE NOT FOUND
        </p>
      </div>
    </main>
  );
}
