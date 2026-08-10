import { Code2 } from "lucide-react";
import React from "react";

function Emptypage() {
  return (
    <div className="h-full">
      <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e]">
        <Code2 className="h-20 w-20 text-[#007acc]/30" />

        <div className="mt-3 text-center">
          <p className="text-lg text-white">No file open</p>
          <p className="text-xs text-gray-400">Select a file from explorer</p>
        </div>
      </div>
    </div>
  );
}

export default Emptypage;
