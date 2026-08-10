import { Sparkles } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
        <Sparkles className="size-5 text-purple-400" />
      </div>

      <h3 className="text-sm font-semibold text-gray-200">CodeSync AI</h3>

      <p className="mt-2 max-w-sm text-xs leading-5 text-gray-500">
        Ask questions about your code, debug errors, explain functions, or get
        suggestions to improve your code.
      </p>

      <div className="mt-5 grid w-full max-w-sm gap-2 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5 text-left text-xs text-gray-400 transition-colors hover:border-purple-500/40 hover:bg-[#2a2a2d] hover:text-gray-200"
        >
          <span className="block text-gray-300">Explain code</span>
          <span className="mt-1 block text-[10px] text-gray-600">
            Understand what your code does
          </span>
        </button>

        <button
          type="button"
          className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5 text-left text-xs text-gray-400 transition-colors hover:border-purple-500/40 hover:bg-[#2a2a2d] hover:text-gray-200"
        >
          <span className="block text-gray-300">Find a bug</span>
          <span className="mt-1 block text-[10px] text-gray-600">
            Debug your current implementation
          </span>
        </button>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-[10px] text-gray-600">
        <span>Tip:</span>
        <span>mention</span>
        <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-purple-400">
          @bot
        </span>
        <span>to talk to CodeSync AI</span>
      </div>
    </div>
  );
}
