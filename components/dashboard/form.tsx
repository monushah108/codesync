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
    description: "Static web project",
    icon: Globe,
    available: true,
  },
  {
    value: "frontend",
    label: "Frontend",
    description: "React + Vite",
    icon: Code2,
    available: false,
  },
  {
    value: "backend",
    label: "Backend",
    description: "Node.js / Express",
    icon: Server,
    available: false,
  },
  {
    value: "node-cli",
    label: "Node.js CLI",
    description: "Terminal programs",
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
      className="mx-auto w-full max-w-[440px] px-3 sm:px-0"
    >
      <div className="overflow-hidden rounded-xl border border-[#2a2d32] bg-[#18191c] shadow-2xl shadow-black/30">
        {/* Header */}
        <div className="border-b border-[#292c31] bg-[#1b1c20] px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                <Code2
                  className="h-[17px] w-[17px] text-indigo-400"
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                  CodeSync
                </p>

                <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight text-slate-100">
                  Create a workspace
                </h2>
              </div>
            </div>

            <div className="shrink-0 rounded-md border border-[#303339] bg-[#202126] px-2 py-1 text-[10px] font-medium text-slate-500">
              Step {step} of 2
            </div>
          </div>

          {/* Progress */}
          {/* Step indicator */}
          <div className="mt-5 flex items-center">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  "border text-[11px] font-semibold transition-all",
                  step === 1
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                    : "border-indigo-500/40 bg-indigo-500/10 text-indigo-400",
                )}
              >
                {step > 1 ? <Check size={13} strokeWidth={2.5} /> : "1"}
              </div>

              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium",
                  step === 1 ? "text-slate-200" : "text-slate-500",
                )}
              >
                Room details
              </span>
            </div>

            {/* Connector */}
            <div
              className={cn(
                "mx-3 h-px flex-1 transition-colors",
                step === 2 ? "bg-indigo-500/60" : "bg-[#303339]",
              )}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  "border text-[11px] font-semibold transition-all",
                  step === 2
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                    : "border-[#35383e] bg-[#202126] text-slate-600",
                )}
              >
                2
              </div>

              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium",
                  step === 2 ? "text-slate-200" : "text-slate-600",
                )}
              >
                Project type
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="bg-[#18191c] p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-200">
                  Room details
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Give your workspace a name and optionally add tags.
                </p>
              </div>

              <FieldGroup className="gap-5">
                {/* Room name */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="mb-2 text-[11px] font-medium text-slate-400"
                  >
                    Room name
                  </FieldLabel>

                  <div className="relative">
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
                      placeholder="my-project"
                      autoComplete="off"
                      className={cn(
                        "h-10 rounded-lg border-[#303339] bg-[#202126] px-3 text-sm text-slate-200",
                        "placeholder:text-slate-600",
                        "transition-colors",
                        "hover:border-[#3a3d43]",
                        "focus-visible:border-indigo-500/70",
                        "focus-visible:ring-2 focus-visible:ring-indigo-500/10",
                        errors.name && "border-red-500/50",
                      )}
                    />
                  </div>

                  {!errors.name && (
                    <p className="mt-1.5 text-[10px] text-slate-600">
                      Use a unique name without spaces.
                    </p>
                  )}

                  {errors.name && (
                    <FieldError className="mt-1.5 text-[11px]">
                      {errors.name[0]}
                    </FieldError>
                  )}
                </Field>

                {/* Tags */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-[11px] font-medium text-slate-400">
                      Tags
                    </FieldLabel>

                    <span className="text-[10px] text-slate-600">Optional</span>
                  </div>

                  {TAGS.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
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
                              "rounded-md border px-2.5 py-1.5 text-[10px] font-medium transition-all",
                              selected
                                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                                : "border-[#303339] bg-[#202126] text-slate-500 hover:border-[#41444a] hover:text-slate-300",
                            )}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.tags && (
                    <FieldError className="mt-1.5 text-[11px]">
                      {errors.tags[0]}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="h-10 w-full rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-500 active:scale-[0.99]"
              >
                Continue
                <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[13px] font-semibold text-slate-200">
                  Choose project type
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select the environment for your workspace.
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
                        "group relative flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left",
                        "transition-all duration-150",
                        type.available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-55",
                        selected
                          ? "border-indigo-500/50 bg-indigo-500/[0.08] shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)]"
                          : type.available
                            ? "border-[#303339] bg-[#202126] hover:border-[#41444a] hover:bg-[#232429]"
                            : "border-[#292c31] bg-[#1d1e22]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          selected
                            ? "border-indigo-500/25 bg-indigo-500/10 text-indigo-400"
                            : "border-[#303339] bg-[#191a1e] text-slate-500",
                        )}
                      >
                        <TypeIcon size={16} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "truncate text-xs font-medium",
                              selected ? "text-slate-100" : "text-slate-300",
                            )}
                          >
                            {type.label}
                          </p>

                          {!type.available && (
                            <span className="shrink-0 rounded border border-[#34373d] bg-[#25262b] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-slate-600">
                              Soon
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-[10px] text-slate-600">
                          {type.description}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                          selected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : "border-[#44474d] text-transparent",
                        )}
                      >
                        <Check size={9} strokeWidth={2.5} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {errors.projectType && (
                <FieldError className="text-[11px]">
                  {errors.projectType[0]}
                </FieldError>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-10 flex-1 rounded-lg border-[#303339] bg-[#202126] text-xs text-slate-400 hover:bg-[#25262b] hover:text-slate-200"
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || isNavigating}
                  className="h-10 flex-1 rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending || isNavigating ? (
                    <Spinner />
                  ) : (
                    <>
                      Create room
                      <Check size={14} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#292c31] bg-[#1b1c20] px-5 py-3">
          <p className="text-center text-[10px] text-slate-600">
            Create a room. Invite your peers. Code together.
          </p>
        </div>
      </div>
    </form>
  );
}
