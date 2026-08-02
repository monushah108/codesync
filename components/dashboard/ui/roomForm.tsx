import { TAGS } from "@/components/constant/dashboard";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Toaster } from "@/components/ui/sonner";
import { getLink } from "@/lib/api/shareApi";
import { playSchema } from "@/lib/schema/playground";
import { RoomActions } from "@/lib/store/actions/useRoomAction";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Copy, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RoomForm({
  setRoom,
  inputBg,
  s,
  txtColor,
  muted,
  handleClose,
}) {
  const [name, setName] = useState("");
  const router = useRouter();

  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [roomId, setRoomId] = useState("");
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"create" | "created" | "linked">("create");

  const [tags, setTags] = useState<string[]>([]);

  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }

    const payload = {
      name,

      type: visibility,
      tags,
    };

    const parsed = playSchema.safeParse(payload);
    console.log(parsed, payload);
    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.name?.[0] ?? "");
      return;
    }

    try {
      setLoading(true);
      console.log(parsed.data);
      const room = RoomActions.createRoom(parsed.data);

      setRoom(room);
      setRoomId(room._id);
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

      {/* Room Tags */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border p-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">Tags</span>

              {tags.length > 0 && (
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs">
                  {tags.length}
                </span>
              )}
            </div>

            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const selected = tags.includes(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  disabled={!selected && tags.length >= 5}
                  onClick={() =>
                    setTags((prev) =>
                      selected ? prev.filter((t) => t !== tag) : [...prev, tag],
                    )
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs transition",
                    selected
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

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
