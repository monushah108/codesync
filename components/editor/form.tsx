"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Globe2,
  LockKeyhole,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Spinner } from "../ui/spinner";

import { playSchema } from "@/lib/schema/playground";

export default function Form() {
  const [name, setRoomName] = useState("codex");

  const [roomType, setRoomType] = useState<"public" | "private">("public");

  const [duration, setDuration] = useState<"no-expiration" | "expiration">(
    "no-expiration",
  );

  const [errors, setErrors] = useState<
    Partial<
      Record<
        "maxUser" | "duration" | "password" | "name" | "roomType",
        string[]
      >
    >
  >({});

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleForm = async () => {
    startTransition(async () => {
      const newRoom = {
        name,
        type: roomType,
        duration,
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

  const optionClass = (active: boolean) =>
    [
      "group flex cursor-pointer items-center gap-3",
      "rounded-xl border px-4 py-3.5",
      "transition-all duration-200",
      active
        ? "border-indigo-500/50 bg-indigo-500/[0.08] shadow-[0_0_20px_rgba(99,102,241,0.06)]"
        : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60",
    ].join(" ");

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

            {/* Visibility */}
            <Field>
              <FieldLabel className="mb-2 text-xs font-medium text-slate-300">
                Visibility
              </FieldLabel>

              <RadioGroup
                value={roomType}
                onValueChange={(value) =>
                  setRoomType(value as "public" | "private")
                }
                className="grid grid-cols-2 gap-2.5"
              >
                {/* Public */}
                <label
                  htmlFor="public"
                  className={optionClass(roomType === "public")}
                >
                  <RadioGroupItem
                    value="public"
                    id="public"
                    className="border-slate-600 text-indigo-500"
                  />

                  <Globe2
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      roomType === "public"
                        ? "text-indigo-400"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200">Public</p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-600">
                      Anyone with the link
                    </p>
                  </div>
                </label>

                {/* Private */}
                <label
                  htmlFor="private"
                  className={optionClass(roomType === "private")}
                >
                  <RadioGroupItem
                    value="private"
                    id="private"
                    className="border-slate-600 text-indigo-500"
                  />

                  <LockKeyhole
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      roomType === "private"
                        ? "text-violet-400"
                        : "text-slate-500 group-hover:text-slate-400"
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200">
                      Private
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-slate-600">
                      Restricted access
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </Field>

            {/* Divider */}
            <div className="h-px bg-slate-800/70" />

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
