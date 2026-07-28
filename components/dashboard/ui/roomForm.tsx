import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
import { CreateRoom } from "@/lib/api/codeApi";
import { getLink } from "@/lib/api/shareApi";
import { playSchema } from "@/lib/schema/playground";
import { Check, Copy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RoomForm({ inputBg, s, txtColor, muted, handleClose }) {
  const [name, setName] = useState("");
  const router = useRouter();
  const [shareUrl, setShareUrl] = useState("");
  const [expiry, setExpiry] = useState<"never" | "24h" | "7d">("never");

  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [copied, setCopied] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"create" | "created" | "linked">("create");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }

    const payload = {
      name,
      duration: expiry,
      type: visibility,
    };

    const parsed = playSchema.safeParse(payload);
    console.log(parsed);
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.name?.[0] ?? "");
      return;
    }

    try {
      setLoading(true);

      const room = await CreateRoom(parsed.data);

      setRoomId(room.roomId);
      setCreated(true);
      setStep("created");
      toast.success("Room created successfully!");
    } catch (err: any) {
      toast.error(err.message ?? "Unable to create room.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoToRoom() {
    router.push(`/playground/${roomId}`);
  }

  async function handleCopy() {
    if (!shareUrl) return;

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    toast.success("Link copied.");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function handleGenerateLink() {
    try {
      setLoading(true);

      const { token } = await getLink({
        roomId,
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/share/${token}`;

      setShareUrl(url);
      setStep("linked");
    } catch {
      toast.error("Unable to generate link.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setName("");
    setError("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="top-center" />
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
          visibility
        </label>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["private", "Private"],

            ["public", "Public"],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-lg border p-2 cursor-pointer"
              style={{
                border:
                  visibility === value
                    ? "1px solid #6366F1"
                    : `1px solid ${
                        s ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)"
                      }`,
              }}
            >
              <input
                type="radio"
                checked={visibility === value}
                onChange={() => setVisibility(value as any)}
              />
              {label}
            </label>
          ))}
        </div>
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
      <div className="space-y-2">
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
            className="cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {step == "created" && (
          <Button
            type="button"
            onClick={handleGenerateLink}
            disabled={loading}
            className="flex-1 bg-transparent text-black cursor-pointer"
          >
            {loading ? "Generating..." : "Generate Link"}
          </Button>
        )}
      </div>
      {/* Actions */}
      <div className="flex gap-2.5 pt-2">
        {step == "create" && (
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 h-11 rounded-xl border border-[#6366F1]/25 bg-[#161B2D] text-[#A5B4FC] transition-all duration-200 hover:border-[#6366F1]/50 hover:bg-[#1D2340] hover:text-white cursor-pointer"
          >
            Cancel
          </Button>
        )}

        {step == "create" && (
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-white font-semibold cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            }}
          >
            <Sparkles size={14} />
            {loading ? "Creating..." : "Create Room"}
          </motion.button>
        )}

        {created && (
          <Button
            type="button"
            onClick={handleGoToRoom}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-white font-semibold w-full cursor-pointer"
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            }}
          >
            Go to Room
          </Button>
        )}
      </div>
    </form>
  );
}
