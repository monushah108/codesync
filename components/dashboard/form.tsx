"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Globe,
  Server,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "../ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

import { playSchema } from "@/lib/schema/playground";
import { TAGS } from "../constant/dashboard";
import { cn } from "@/lib/utils";
import { CreateRoom } from "@/lib/api/roomApi";
import { Room } from "@/lib/store/types/roomTypes";
import { ApiError } from "@/lib/api/codeApi";

const PROJECT_TYPES = [
  {
    value: "static",
    label: "HTML / CSS / JS",
    description: "Static web project with zero dependencies",
    icon: Globe,
    available: true,
  },
  {
    value: "frontend",
    label: "Frontend React",
    description: "React 19 + Vite sandbox",
    icon: Code2,
    available: false,
  },
  {
    value: "backend",
    label: "Node.js Backend",
    description: "Express & REST API runtime",
    icon: Server,
    available: false,
  },
  {
    value: "node-cli",
    label: "Node.js CLI",
    description: "Command-line terminal programs",
    icon: Terminal,
    available: false,
  },
] as const;

type FormErrors = Partial<Record<"name" | "tags" | "projectType", string[]>>;

export default function Form() {
  const [name, setName] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("static");
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleForm = async () => {
    if (!name.trim() || /\s/.test(name)) {
      setErrors({
        name: ["Use a room name without spaces."],
      });
      setStep(1);
      return;
    }

    startTransition(async () => {
      const newRoom = {
        name: name.trim(),
        tags,
        projectType,
      };

      const { success, data, error } = playSchema.safeParse(newRoom);

      if (!success) {
        setErrors(error.flatten().fieldErrors as FormErrors);
        return;
      }

      setErrors({});

      try {
        const response: Room = await CreateRoom(data);
        toast.success("Room created successfully!");
        setIsNavigating(true);
        router.push(`/playground/${response._id}`);
      } catch (err) {
        console.error(err);
        setIsNavigating(false);

        const apiError = err as ApiError;

        if (apiError.status === 422) {
          toast.error(apiError.message || "Validation failed");
          return;
        }

        if (apiError.status === 409) {
          toast.error(
            apiError.message || "A room with this name already exists",
          );
          return;
        }

        toast.error("A server error occurred. Please try again.");
      }
    });
  };

  const goNext = () => {
    if (!name.trim()) {
      setErrors({ name: ["Room name is required"] });
      return;
    }

    if (/\s/.test(name)) {
      setErrors({
        name: ["Use a room name without spaces."],
      });
      return;
    }

    setErrors({});
    setStep(2);
  };

  const goBack = () => {
    setErrors({});
    setStep(1);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 1) {
          goNext();
          return;
        }
        handleForm();
      }}
      className="mx-auto w-full max-w-[460px] px-3 sm:px-0"
    >
      {/* VS Code Panel / Modal Card */}
      <div className="overflow-hidden rounded-lg border border-[#cecece] dark:border-[#333333] bg-[#ffffff] dark:bg-[#252526] shadow-sm transition-colors">
        {/* Header - Solid VS Code Titlebar / Panel Header */}
        <div className="border-b border-[#cecece] dark:border-[#333333] bg-[#f8f8f8] dark:bg-[#1f1f1f] px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-[#007acc]/25 bg-[#007acc]/10 text-[#007acc]">
                <Code2 className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858585]">
                  Workspace Setup
                </p>

                <h2 className="text-sm font-bold tracking-tight text-[#1e1e1e] dark:text-[#ffffff]">
                  Create a collaboration room
                </h2>
              </div>
            </div>

            <div className="shrink-0 rounded border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#2d2d2d] px-2 py-0.5 text-[10px] font-medium text-[#616161] dark:text-[#858585]">
              Step {step} of 2
            </div>
          </div>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                  step === 1
                    ? "bg-[#007acc] text-white"
                    : "border border-[#007acc]/40 bg-[#007acc]/10 text-[#007acc]",
                )}
              >
                {step > 1 ? <Check size={11} strokeWidth={2.5} /> : "1"}
              </div>

              <span
                className={cn(
                  "whitespace-nowrap text-xs",
                  step === 1
                    ? "font-semibold text-[#1e1e1e] dark:text-[#ffffff]"
                    : "text-[#858585]",
                )}
              >
                Room details
              </span>
            </div>

            {/* Connector */}
            <div
              className={cn(
                "mx-3 h-px flex-1 transition-colors",
                step === 2
                  ? "bg-[#007acc]"
                  : "bg-[#cecece] dark:bg-[#333333]",
              )}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                  step === 2
                    ? "bg-[#007acc] text-white"
                    : "border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#2d2d2d] text-[#858585]",
                )}
              >
                2
              </div>

              <span
                className={cn(
                  "whitespace-nowrap text-xs",
                  step === 2
                    ? "font-semibold text-[#1e1e1e] dark:text-[#ffffff]"
                    : "text-[#858585]",
                )}
              >
                Project type
              </span>
            </div>
          </div>
        </div>

        {/* Form Body - Solid VS Code Editor Surface */}
        <div className="p-6 bg-[#ffffff] dark:bg-[#252526] transition-colors">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#1e1e1e] dark:text-[#ffffff]">
                  Name your workspace
                </h3>
                <p className="mt-0.5 text-xs text-[#616161] dark:text-[#969696] leading-relaxed">
                  Choose a unique room name for you and your collaborators.
                </p>
              </div>

              <FieldGroup className="gap-3.5">
                {/* Room name */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="mb-1 text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc] block"
                  >
                    Room Name
                  </FieldLabel>

                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (errors.name) {
                        setErrors((previous) => ({
                          ...previous,
                          name: undefined,
                        }));
                      }
                    }}
                    placeholder="e.g. peer-review, team-sync"
                    autoComplete="off"
                    className={cn(
                      "h-9 rounded-md border border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#313131] px-3 text-xs text-[#1e1e1e] dark:text-[#cccccc] placeholder:text-[#858585] shadow-none focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-colors",
                      errors.name && "border-rose-500 focus-visible:border-rose-500",
                    )}
                  />

                  {!errors.name ? (
                    <p className="mt-1 text-[11px] text-[#858585]">
                      Use letters, numbers, or dashes without spaces.
                    </p>
                  ) : (
                    <FieldError className="mt-1 text-xs text-rose-500">
                      {errors.name[0]}
                    </FieldError>
                  )}
                </Field>

                {/* Tags */}
                <Field>
                  <div className="flex items-center justify-between mb-1">
                    <FieldLabel className="text-xs font-medium text-[#1e1e1e] dark:text-[#cccccc]">
                      Activity Tags
                    </FieldLabel>
                    <span className="text-[11px] text-[#858585]">Optional</span>
                  </div>

                  {TAGS.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {TAGS.map((tag) => {
                        const selected = tags.includes(tag);

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setTags((previous) =>
                                selected
                                  ? previous.filter((item) => item !== tag)
                                  : [...previous, tag],
                              );
                            }}
                            className={cn(
                              "rounded border px-2 py-0.5 text-xs font-medium transition-colors",
                              selected
                                ? "border-[#007acc] bg-[#007acc]/15 text-[#007acc] dark:text-[#3794ff]"
                                : "border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#2d2d2d] text-[#616161] dark:text-[#cccccc] hover:bg-[#e5e5e5] dark:hover:bg-[#37373d]",
                            )}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.tags && (
                    <FieldError className="mt-1 text-xs text-rose-500">
                      {errors.tags[0]}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="h-9 w-full rounded-md bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] text-white font-medium text-xs shadow-none transition-colors gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight size={13} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#1e1e1e] dark:text-[#ffffff]">
                  Choose project environment
                </h3>
                <p className="mt-0.5 text-xs text-[#616161] dark:text-[#969696] leading-relaxed">
                  Select the runtime template for this workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PROJECT_TYPES.map((type) => {
                  const selected = projectType === type.value;
                  const TypeIcon = type.icon;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      disabled={!type.available}
                      onClick={() => {
                        if (!type.available) return;
                        setProjectType(type.value);
                        if (errors.projectType) {
                          setErrors((previous) => ({
                            ...previous,
                            projectType: undefined,
                          }));
                        }
                      }}
                      className={cn(
                        "group relative flex min-w-0 items-center gap-2.5 rounded-md border p-3 text-left transition-colors",
                        type.available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50",
                        selected
                          ? "border-[#007acc] bg-[#007acc]/10 dark:bg-[#04395e]/40"
                          : type.available
                            ? "border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#2d2d2d] hover:bg-[#f3f3f3] dark:hover:bg-[#323233]"
                            : "border-[#cecece]/50 dark:border-[#333333]/50 bg-[#f8f8f8] dark:bg-[#202020]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-colors",
                          selected
                            ? "border-[#007acc]/40 bg-[#007acc]/20 text-[#007acc] dark:text-[#3794ff]"
                            : "border-[#cecece] dark:border-[#3c3c3c] bg-[#f8f8f8] dark:bg-[#1e1e1e] text-[#858585]",
                        )}
                      >
                        <TypeIcon size={15} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p
                            className={cn(
                              "truncate text-xs font-medium",
                              selected
                                ? "text-[#007acc] dark:text-[#ffffff] font-semibold"
                                : "text-[#1e1e1e] dark:text-[#cccccc]",
                            )}
                          >
                            {type.label}
                          </p>

                          {!type.available && (
                            <span className="shrink-0 rounded border border-[#cecece] dark:border-[#3c3c3c] bg-[#f0f0f0] dark:bg-[#333333] px-1 py-0.2 text-[8px] font-medium uppercase tracking-wider text-[#858585]">
                              Soon
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-[10px] text-[#616161] dark:text-[#858585]">
                          {type.description}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          selected
                            ? "border-[#007acc] bg-[#007acc] text-white"
                            : "border-[#cecece] dark:border-[#3c3c3c] text-transparent",
                        )}
                      >
                        <Check size={8} strokeWidth={2.5} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.projectType && (
                <FieldError className="text-xs text-rose-500">
                  {errors.projectType[0]}
                </FieldError>
              )}

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-9 flex-1 rounded-md border-[#cecece] dark:border-[#3c3c3c] bg-[#ffffff] dark:bg-[#2d2d2d] text-xs font-medium text-[#616161] dark:text-[#cccccc] hover:bg-[#f0f0f0] dark:hover:bg-[#37373d] shadow-none"
                >
                  <ArrowLeft size={13} className="mr-1" />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || isNavigating}
                  className="h-9 flex-1 rounded-md bg-[#007acc] hover:bg-[#0062a3] dark:hover:bg-[#0e639c] text-white text-xs font-medium shadow-none disabled:opacity-60 transition-colors"
                >
                  {isPending || isNavigating ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <>
                      <span>Launch Workspace</span>
                      <Check size={13} className="ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#cecece] dark:border-[#333333] bg-[#f8f8f8] dark:bg-[#1f1f1f] px-6 py-2.5">
          <p className="text-center text-[11px] text-[#858585]">
            Create a room • Invite your peers • Code together with zero latency
          </p>
        </div>
      </div>
    </form>
  );
}
