import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Check, Copy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function RoomForm({ inputBg, s, txtColor, muted, handleClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [expiry, setExpiry] = useState<"never" | "1h" | "24h" | "7d">("never");

  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [copied, setCopied] = useState(false);
  const [generateLink, setGenerateLink] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }

    reset();
  }

  const handleCopy = () => {};

  function reset() {
    setName("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Room name */}
      <div>
        <label
          className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
          style={{ color: muted, letterSpacing: "0.07em" }}
        >
          Room Name
        </label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="e.g. Frontend Interview, API Review..."
          autoFocus
          className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
          style={{
            background: inputBg,
            border: error
              ? "1px solid rgba(239,68,68,0.6)"
              : `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            color: txtColor,
            fontFamily: "'Inter', sans-serif",
          }}
          onFocus={(e) => {
            if (!error) {
              (e.currentTarget as HTMLInputElement).style.border =
                "1px solid rgba(99,102,241,0.5)";
              (e.currentTarget as HTMLInputElement).style.boxShadow =
                "0 0 0 3px rgba(99,102,241,0.08)";
            }
          }}
          onBlur={(e) => {
            if (!error) {
              (e.currentTarget as HTMLInputElement).style.border =
                `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`;
              (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
            }
          }}
        />
        {error && (
          <p className="text-xs mt-1.5" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}
      </div>

      {/* duration  */}
      <div>
        <label
          className="block text-xs font-semibold mb-3 uppercase tracking-wider"
          style={{ color: muted }}
        >
          Duration
        </label>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["never", "Never"],

            ["24h", "24 Hours"],
            ["7d", "7 Days"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer"
              style={{
                border:
                  expiry === value
                    ? "1px solid #6366F1"
                    : `1px solid ${
                        s ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"
                      }`,
              }}
            >
              <input
                type="radio"
                checked={expiry === value}
                onChange={() => setExpiry(value as any)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      {/* generate link  */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <InputGroup className="flex-1">
            <InputGroupInput
              value={shareUrl}
              readOnly
              placeholder="Generate a share link..."
            />
          </InputGroup>

          <Button
            variant="secondary"
            size="icon"
            onClick={handleCopy}
            disabled={!shareUrl}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <button
          className="text-sm font-semibold cursor-pointer"
          // onClick={generateLink}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Link"}
        </button>
      </div>
      {/* Actions */}
      <div className="flex gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none"
          style={{
            background: s ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            color: muted,
            border: `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = s
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.07)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = s
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.04)")
          }
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 28px rgba(99,102,241,0.5)",
          }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white outline-none"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <Sparkles size={13} />
          Create Room
        </motion.button>
      </div>
    </form>
  );
}
