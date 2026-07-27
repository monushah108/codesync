import { Ban } from "lucide-react";
import Link from "next/link";

export default function Banned() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-[#1e1e1e] text-white">
      <div className="max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <Ban className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold">Access Restricted</h1>

        <p className="text-gray-400">
          You have been banned from this room. If you think this is a mistake,
          please contact the room administrator.
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
