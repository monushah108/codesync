import Hero from "@/components/dashboard/hero";
import RecentRooms from "@/components/dashboard/recents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard ",
  description: "View, manage, and collaborate in your CodeSync workspaces.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f3f3f3] dark:bg-[#1e1e1e] text-[#1e1e1e] dark:text-[#cccccc] transition-colors">
      {/* Content Container */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero with integrated Top Bar, Profile & Actions */}
        <Hero />

        {/* Recent Workspaces Table */}
        <RecentRooms />
      </div>
    </main>
  );
}
