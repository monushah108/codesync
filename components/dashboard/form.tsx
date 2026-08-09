"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Globe2,
  LockKeyhole,
  Clock3,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

import { playSchema } from "@/lib/schema/playground";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { TAGS } from "../constant/dashboard";
import { cn } from "@/lib/utils";

export default function Form() {
  const [name, setRoomName] = useState("codex");

  const [tags, setTags] = useState<string[]>([]);

  const [errors, setErrors] = useState<
    Partial<
      Record<
        "maxUser" | "duration" | "password" | "name" | "roomType",
        string[]
      >
    >
  >({});

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleForm = async () => {
    startTransition(async () => {
      const newRoom = {
        name,
        tags,
      };

      const { success, data, error } = playSchema.safeParse(newRoom);

      if (!success) {
        setErrors(error.flatten().fieldErrors);
        return;
      }

      setErrors({});

      try {
        const response = await fetch("/api/playground", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 201) {
          toast.success("Room created successfully!");
          router.push(`/playground/${result.roomId}`);
          return;
        }

        if (response.status === 422) {
          toast.error(result.error || "Validation failed");
          return;
        }

        if (response.status === 409) {
          toast.error(result.error || "A room with this name already exists");
          return;
        }

        toast.error(result.error || "Unable to create room");
      } catch (err) {
        console.error(err);

        toast.error("A server error occurred. Please try again.");
      }
    });
  };

  return (
    <form action={handleForm} className="mx-auto w-full max-w-lg">
      {/* Main form */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-px shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="rounded-[15px] border border-slate-800/40 bg-[#0c0c0f]/90 px-5 py-6 sm:px-7 sm:py-7">
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                New workspace
              </span>
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">
              Create a room
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Configure your workspace and start collaborating.
            </p>
          </div>

          <FieldGroup className="gap-6">
            {/* Room name */}
            <Field>
              <FieldLabel className="mb-2 text-xs font-medium text-slate-300">
                Room name
              </FieldLabel>

              <Input
                value={name}
                onChange={(e) => {
                  setRoomName(e.target.value);

                  if (errors.name) {
                    setErrors((prev) => ({
                      ...prev,
                      name: undefined,
                    }));
                  }
                }}
                name="name"
                placeholder="e.g. frontend-project"
                className={`h-10 rounded-lg border-slate-800 bg-slate-950/70 text-sm text-slate-200 shadow-none placeholder:text-slate-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/10 ${
                  errors.name
                    ? "border-red-500/60 focus-visible:border-red-500/60 focus-visible:ring-red-500/10"
                    : ""
                }`}
              />

              {errors.name && (
                <FieldError className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                  <CircleAlert className="h-3 w-3" />
                  {errors.name[0]}
                </FieldError>
              )}
            </Field>

            {/* Divider */}
            <div className="h-px bg-slate-800/70" />

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
                            selected
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag],
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="group h-10 w-full rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] text-sm font-medium text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:bg-right hover:shadow-indigo-500/20 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating room...
                </>
              ) : (
                <>
                  Create room
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </Button>
          </FieldGroup>
        </div>
      </div>

      {/* Bottom hint */}
      <p className="mt-4 text-center text-[10px] tracking-wide text-slate-600">
        Invite collaborators after creating your room.
      </p>
    </form>
  );
}
