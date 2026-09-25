import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Clock,
  Home,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  ServerCrash,
} from "lucide-react";

interface PlaygroundErrorProps {
  status: number;
  message?: string;
  roomId?: string;
}

export default function PlaygroundError({
  status,
  message,
  roomId,
}: PlaygroundErrorProps) {
  // Determine layout, icons, badges and colors based on HTTP status
  const getErrorConfig = () => {
    switch (status) {
      case 401:
        return {
          title: "Sign In Required",
          badge: "401 • Authentication Required",
          icon: <LockKeyhole className="size-7" strokeWidth={1.75} />,
          badgeColor:
            "border-amber-500/20 bg-amber-500/10 text-amber-400",
          iconColor:
            "border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/10",
          glowColor: "bg-amber-500/10",
          dotColor: "bg-amber-400",
          primaryAction: {
            href: "/auth/login",
            label: "Sign In to Continue",
            icon: <LogIn className="size-3.5" />,
          },
        };

      case 403:
        return {
          title: "Access Denied",
          badge: "403 • Access Restricted",
          icon: <Ban className="size-7" strokeWidth={1.75} />,
          badgeColor: "border-red-500/20 bg-red-500/10 text-red-400",
          iconColor:
            "border-red-500/30 bg-red-500/10 text-red-400 shadow-red-500/10",
          glowColor: "bg-red-500/10",
          dotColor: "bg-red-400",
          primaryAction: {
            href: "/dashboard",
            label: "Go to Dashboard",
            icon: <LayoutDashboard className="size-3.5" />,
          },
        };

      case 404:
        return {
          title: "Workspace Not Found",
          badge: "404 • Workspace Unavailable",
          icon: <AlertCircle className="size-7" strokeWidth={1.75} />,
          badgeColor:
            "border-[#007acc]/20 bg-[#007acc]/10 text-[#007acc]",
          iconColor:
            "border-[#007acc]/30 bg-[#007acc]/10 text-[#007acc] shadow-[#007acc]/10",
          glowColor: "bg-[#007acc]/10",
          dotColor: "bg-[#007acc]",
          primaryAction: {
            href: "/dashboard",
            label: "Go to Dashboard",
            icon: <LayoutDashboard className="size-3.5" />,
          },
        };

      case 429:
        return {
          title: "Rate Limit Exceeded",
          badge: "429 • Too Many Requests",
          icon: <Clock className="size-7" strokeWidth={1.75} />,
          badgeColor:
            "border-orange-500/20 bg-orange-500/10 text-orange-400",
          iconColor:
            "border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-orange-500/10",
          glowColor: "bg-orange-500/10",
          dotColor: "bg-orange-400",
          primaryAction: {
            href: "/dashboard",
            label: "Go to Dashboard",
            icon: <LayoutDashboard className="size-3.5" />,
          },
        };

      case 400:
        return {
          title: "Invalid Workspace Request",
          badge: "400 • Invalid Workspace ID",
          icon: <AlertTriangle className="size-7" strokeWidth={1.75} />,
          badgeColor:
            "border-purple-500/20 bg-purple-500/10 text-purple-400",
          iconColor:
            "border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-purple-500/10",
          glowColor: "bg-purple-500/10",
          dotColor: "bg-purple-400",
          primaryAction: {
            href: "/dashboard",
            label: "Go to Dashboard",
            icon: <LayoutDashboard className="size-3.5" />,
          },
        };

      default:
        return {
          title: "Workspace Error",
          badge: `${status || 500} • Server Error`,
          icon: <ServerCrash className="size-7" strokeWidth={1.75} />,
          badgeColor: "border-rose-500/20 bg-rose-500/10 text-rose-400",
          iconColor:
            "border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-rose-500/10",
          glowColor: "bg-rose-500/10",
          dotColor: "bg-rose-400",
          primaryAction: {
            href: "/dashboard",
            label: "Go to Dashboard",
            icon: <LayoutDashboard className="size-3.5" />,
          },
        };
    }
  };

  const config = getErrorConfig();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1e1e1e] px-4 text-[#cccccc] select-none font-sans">
      {/* Background ambient glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] ${config.glowColor}`}
      />

      {/* Editor Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-[#2d2d30] bg-[#252526] p-6 sm:p-8 text-center shadow-2xl shadow-black/70">
        {/* Status Icon */}
        <div
          className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-xl border shadow-inner ${config.iconColor}`}
        >
          {config.icon}
        </div>

        {/* Status Pill */}
        <div
          className={`mb-3 inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${config.badgeColor}`}
        >
          <span className={`size-1.5 rounded-full ${config.dotColor}`} />
          <span>{config.badge}</span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-tight text-white">
          {config.title}
        </h1>

        {/* Server Error Message */}
        <div className="mt-3 rounded-md bg-[#1f1f1f] border border-[#333333] px-3.5 py-2.5 text-center">
          <p className="text-xs leading-relaxed text-[#a8a8a8]">
            {message || "An unexpected error occurred while loading this workspace."}
          </p>
        </div>

        {/* Room ID Badge (if available) */}
        {roomId && (
          <p className="mt-2.5 text-[10px] font-mono text-[#666666]">
            Workspace ID: <span className="text-[#888888]">{roomId}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            href={config.primaryAction.href}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded bg-[#007acc] px-4 text-xs font-medium text-white shadow-xs transition hover:bg-[#0062a3] cursor-pointer"
          >
            {config.primaryAction.icon}
            {config.primaryAction.label}
          </Link>

          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 text-xs font-medium text-[#cccccc] transition hover:bg-[#2a2d2e] hover:text-white cursor-pointer"
          >
            <Home className="size-3.5" />
            Home Page
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-6 text-[10px] font-mono tracking-wider text-[#555555]">
          CODESYNC • WORKSPACE STATUS
        </p>
      </div>
    </main>
  );
}
