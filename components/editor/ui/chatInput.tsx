import { Send } from "lucide-react";

interface InputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: (message: string) => void;
  generating: boolean;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function ChatInput({
  message,
  setMessage,
  onSend,
  generating,
  handleKeyDown,
}: InputProps) {
  const mentionsBot = /@bot\b/i.test(message);
  const canSend = message.trim().length > 0 && !generating;

  const handleSend = () => {
    const value = message.trim();

    if (!value || generating) return;

    onSend(value);
  };

  return (
    <div className="p-3">
      <div
        className={`
          relative rounded-xl border
          bg-[#252526]
          transition-all duration-200

          ${
            mentionsBot
              ? `
                border-purple-500
                bg-purple-500/[0.03]
                shadow-[0_0_0_1px_rgba(168,85,247,0.15)]
              `
              : `
                border-[#3c3c3c]
                focus-within:border-[#555]
              `
          }
        `}
      >
        {/* @bot indicator */}

        {mentionsBot && (
          <div className="absolute -top-6 left-2 flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-purple-400" />

            <span className="text-[10px] font-medium text-purple-400">
              CodeSync AI mentioned
            </span>
          </div>
        )}

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={generating}
          rows={2}
          placeholder={
            generating
              ? "CodeSync AI is thinking..."
              : "Ask CodeSync AI or mention @bot..."
          }
          className="
            block
            min-h-[52px]
            max-h-32
            w-full
            resize-none
            bg-transparent
            px-3
            py-3
            pr-12
            text-sm
            leading-5
            text-gray-200
            outline-none
            placeholder:text-gray-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`
            absolute
            bottom-2
            right-2
            flex
            size-8
            items-center
            justify-center
            rounded-lg
            transition-all

            ${
              canSend
                ? "bg-purple-600 text-white hover:bg-purple-500"
                : "bg-[#333336] text-gray-600"
            }
          `}
        >
          {generating ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-gray-600 border-t-gray-300" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between px-1">
        <span className="text-[10px] text-gray-600">
          Enter to send · Shift + Enter for newline
        </span>

        {mentionsBot && (
          <span className="text-[10px] text-purple-400">@bot</span>
        )}
      </div>
    </div>
  );
}
