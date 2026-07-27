import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-[#1e1e1e] text-white">
      <div className="max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <ShieldX className="h-12 w-12 text-orange-500" />
        </div>

        <h1 className="text-2xl font-bold">Access Denied</h1>

        <p className="text-gray-400">
          You don't have permission to access this workspace. Request access
          from the room owner or use a valid invitation link.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#007acc] px-4 py-2 text-white transition-colors hover:bg-[#0e639c]"
          >
            Go Back
          </Link>

          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#007acc] px-4 py-2 text-white transition-colors hover:bg-[#0e639c]">
            send request
          </button>
        </div>
      </div>
    </div>
  );
}
