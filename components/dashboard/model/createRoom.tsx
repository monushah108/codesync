import { motion, AnimatePresence } from "motion/react";
import { X, Code2 } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import RoomForm from "../ui/roomForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, language: string, languageColor: string) => void;
  isDark: boolean;
}

export function CreateRoomModal({ open, onClose, isDark }: Props) {
  const s = isDark;

  function handleClose() {
    onClose();
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

                  <RoomForm
                    inputBg={inputBg}
                    s={s}
                    txtColor={txtColor}
                    handleClose={handleClose}
                    muted={muted}
                  />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
