import Link from "next/link";
import { Home, Search } from "lucide-react";

function NotFoundIllustration() {
  return (
    <div className="mx-auto w-full max-w-[320px] select-none">
      <svg
        viewBox="0 0 360 260"
        role="img"
        aria-label="Lost page 404 illustration"
        className="h-auto w-full"
      >
        <defs>
          <linearGradient id="screenGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#303b70" />
            <stop offset="100%" stopColor="#151b35" />
          </linearGradient>

          <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Background glow */}
        <circle
          cx="180"
          cy="115"
          r="92"
          fill="#6366f1"
          opacity="0.12"
          filter="url(#softGlow)"
        />

        {/* Moon */}
        <circle cx="245" cy="60" r="32" fill="#6366f1" opacity="0.75" />
        <circle cx="257" cy="50" r="32" fill="#0f1117" opacity="0.35" />

        {/* Stars */}
        <g fill="#a5b4fc">
          <path d="M65 65 l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
          <path d="M285 105 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          <path d="M115 35 l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        </g>

        {/* Orbit line */}
        <ellipse
          cx="178"
          cy="116"
          rx="125"
          ry="60"
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeDasharray="7 9"
          opacity="0.65"
          transform="rotate(-15 178 116)"
        />

        {/* Cloud left */}
        <g fill="#334477" opacity="0.9">
          <circle cx="70" cy="105" r="15" />
          <circle cx="87" cy="96" r="21" />
          <circle cx="108" cy="105" r="15" />
          <rect x="65" y="104" width="49" height="17" rx="8" />
        </g>

        {/* Main broken browser window */}
        <g transform="rotate(-11 174 139)">
          <rect
            x="82"
            y="70"
            width="185"
            height="135"
            rx="13"
            fill="url(#screenGradient)"
            stroke="#818cf8"
            strokeWidth="2"
          />

          {/* Browser top bar */}
          <path
            d="M95 70 H254 Q267 70 267 83 V96 H82 V83 Q82 70 95 70Z"
            fill="#3b477d"
          />

          <circle cx="99" cy="83" r="5" fill="#fb7185" />
          <circle cx="115" cy="83" r="5" fill="#facc15" />
          <circle cx="131" cy="83" r="5" fill="#2dd4bf" />

          {/* Broken page icon */}
          <path
            d="M150 112 L171 133 L190 112"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M171 133 L171 166"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Sad face */}
          <g stroke="#c7d2fe" strokeWidth="5" strokeLinecap="round">
            <path d="M130 145 l10 10 M140 145 l-10 10" />
            <path d="M202 145 l10 10 M212 145 l-10 10" />
            <path d="M157 180 Q171 166 185 180" fill="none" />
          </g>
        </g>

        {/* Ground */}
        <ellipse
          cx="180"
          cy="222"
          rx="112"
          ry="13"
          fill="#1e293b"
          opacity="0.8"
        />

        {/* Plants */}
        <g fill="url(#purpleGradient)">
          <path d="M75 218 Q55 186 77 180 Q92 198 85 218Z" />
          <path d="M83 218 Q87 180 108 184 Q111 204 83 218Z" />
          <path d="M275 220 Q260 188 281 184 Q297 202 275 220Z" />
          <path d="M282 220 Q289 185 307 191 Q309 209 282 220Z" />
        </g>

        {/* Rocks */}
        <g fill="#64748b">
          <path d="M120 220 l14-24 18 24z" />
          <path d="M218 220 l17-29 21 29z" />
          <path d="M143 220 l10-15 13 15z" opacity="0.65" />
        </g>

        {/* 404 sign */}
        <g transform="rotate(10 282 163)">
          <path
            d="M280 185 V218"
            stroke="#64748b"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <rect
            x="237"
            y="135"
            width="91"
            height="53"
            rx="8"
            fill="#1e293b"
            stroke="#818cf8"
            strokeWidth="2"
          />

          <text
            x="282"
            y="169"
            textAnchor="middle"
            fontSize="27"
            fontWeight="800"
            fill="#c7d2fe"
          >
            404
          </text>
        </g>

        {/* Paper plane */}
        <path
          d="M282 35 L320 20 L305 57 L297 40Z"
          fill="url(#purpleGradient)"
          stroke="#a5b4fc"
          strokeWidth="1.5"
        />

        <path
          d="M282 35 L297 40 L320 20"
          fill="none"
          stroke="#c7d2fe"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f1117] px-6">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 max-w-lg text-center">
        {/* Custom coded illustration */}
        <NotFoundIllustration />

        <h1 className="mt-5 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-6xl font-extrabold text-transparent">
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
