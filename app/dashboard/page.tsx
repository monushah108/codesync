import Header from "@/components/dashboard/header";
import Hero from "@/components/dashboard/hero";
import RecentRooms from "@/components/dashboard/recents";

export default function DashboardPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#09090b] text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="absolute bottom-[-180px] left-[-120px] h-[320px] w-[320px] rounded-full bg-violet-600/5 blur-[110px]" />

        <div className="absolute right-[-120px] top-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[110px]" />
      </div>

      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <Header />

        {/* Hero */}
        <Hero />

        {/* Recent Rooms */}
        <RecentRooms />
      </div>
    </main>
  );
}
