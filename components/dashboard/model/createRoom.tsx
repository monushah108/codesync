import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Code2, ChevronDown, Sparkles } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, language: string, languageColor: string) => void;
  isDark: boolean;
}

const LANGUAGES = [
  { name: "JavaScript", color: "#EAB308" },
  { name: "TypeScript", color: "#3B82F6" },
  { name: "Python", color: "#38BDF8" },
  { name: "Rust", color: "#F97316" },
  { name: "Go", color: "#22D3EE" },
  { name: "C++", color: "#F43F5E" },
  { name: "Java", color: "#EF4444" },
];

export function CreateRoomModal({ open, onClose, onCreate, isDark }: Props) {
  const [name, setName] = useState("");
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [langOpen, setLangOpen] = useState(false);
  const [error, setError] = useState("");

  const s = isDark;

  function reset() {
    setName("");
    setLang(LANGUAGES[0]);
    setError("");
    setLangOpen(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Room name is required.");
      return;
    }
    onCreate(name.trim(), lang.name, lang.color);
    reset();
  }

  const surface = s ? "rgba(13,17,23,0.97)" : "rgba(255,255,255,0.98)";
  const border = s ? "rgba(99,102,241,0.2)" : "rgba(0,0,0,0.08)";
  const inputBg = s ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const txtColor = s ? "#F1F5F9" : "#0F172A";
  const muted = s ? "#475569" : "#94A3B8";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && handleClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50"
                style={{
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(6px)",
                }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-50 left-1/2 top-1/2 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl outline-none overflow-hidden"
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  boxShadow: s
                    ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.08)"
                    : "0 32px 80px rgba(0,0,0,0.15)",
                  backdropFilter: "blur(24px)",
                }}
              >
                {/* Gradient top stripe */}
                <div
                  className="h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #6366F1, #8B5CF6, #6366F1)",
                    opacity: 0.7,
                  }}
                />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          border: "1px solid rgba(99,102,241,0.2)",
                        }}
                      >
                        <Code2 size={16} style={{ color: "#818CF8" }} />
                      </div>
                      <div>
                        <Dialog.Title
                          className="text-[15px] font-semibold"
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: txtColor,
                          }}
                        >
                          New Coding Room
                        </Dialog.Title>
                        <Dialog.Description
                          className="text-xs mt-0.5"
                          style={{ color: muted }}
                        >
                          Start a real-time collaborative session
                        </Dialog.Description>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors outline-none"
                      style={{ color: muted }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = s
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <X size={15} />
                    </button>
                  </div>

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
                            (
                              e.currentTarget as HTMLInputElement
                            ).style.boxShadow =
                              "0 0 0 3px rgba(99,102,241,0.08)";
                          }
                        }}
                        onBlur={(e) => {
                          if (!error) {
                            (e.currentTarget as HTMLInputElement).style.border =
                              `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`;
                            (
                              e.currentTarget as HTMLInputElement
                            ).style.boxShadow = "none";
                          }
                        }}
                      />
                      {error && (
                        <p
                          className="text-xs mt-1.5"
                          style={{ color: "#EF4444" }}
                        >
                          {error}
                        </p>
                      )}
                    </div>

                    {/* Language picker */}
                    <div>
                      <label
                        className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                        style={{ color: muted, letterSpacing: "0.07em" }}
                      >
                        Language
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setLangOpen((v) => !v)}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                          style={{
                            background: inputBg,
                            border: `1px solid ${s ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                            color: txtColor,
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: lang.color }}
                            />
                            <span>{lang.name}</span>
                          </div>
                          <ChevronDown
                            size={13}
                            style={{
                              color: muted,
                              transform: langOpen
                                ? "rotate(180deg)"
                                : "rotate(0)",
                              transition: "transform 0.2s",
                            }}
                          />
                        </button>

                        <AnimatePresence>
                          {langOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -4, scale: 0.97 }}
                              transition={{ duration: 0.12 }}
                              className="absolute z-10 w-full mt-1.5 rounded-xl overflow-hidden py-1"
                              style={{
                                background: s
                                  ? "rgba(15,23,42,0.97)"
                                  : "rgba(255,255,255,0.99)",
                                border: `1px solid ${border}`,
                                boxShadow: s
                                  ? "0 12px 32px rgba(0,0,0,0.5)"
                                  : "0 12px 32px rgba(0,0,0,0.1)",
                                backdropFilter: "blur(16px)",
                              }}
                            >
                              {LANGUAGES.map((l) => (
                                <button
                                  key={l.name}
                                  type="button"
                                  onClick={() => {
                                    setLang(l);
                                    setLangOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors outline-none"
                                  style={{ color: txtColor }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = s
                                      ? "rgba(99,102,241,0.1)"
                                      : "rgba(99,102,241,0.06)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "transparent")
                                  }
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{ background: l.color }}
                                    />
                                    {l.name}
                                  </div>
                                  {lang.name === l.name && (
                                    <svg
                                      width="11"
                                      height="11"
                                      viewBox="0 0 11 11"
                                      fill="none"
                                    >
                                      <path
                                        d="M1.5 5.5L4 8.5L9.5 2.5"
                                        stroke="#6366F1"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors outline-none"
                        style={{
                          background: s
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
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
                          background:
                            "linear-gradient(135deg, #6366F1, #8B5CF6)",
                          boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        <Sparkles size={13} />
                        Create Room
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
