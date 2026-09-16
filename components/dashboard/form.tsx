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
    description: "static",
    icon: Globe,
  },
  {
    value: "frontend",
    label: "Frontend",
    description: "React + Vite",
    icon: Code2,
  },
  {
    value: "backend",
    label: "Backend",
    description: "Node.js / Express",
    icon: Server,
  },

  {
    value: "node-cli",
    label: "Node.js CLI",
    description: "Terminal programs",
    icon: Terminal,
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
        name: ["No spaces are allowed in the room name."],
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
        name: ["No spaces are allowed in the room name."],
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
      className="mx-auto w-full max-w-md px-2 sm:px-0"
    >
      {/* Main container */}
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/15 bg-indigo-500/10">
                <Code2 className="h-4 w-4 text-indigo-400" />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  CodeSync
                </p>

                <h2 className="text-base font-semibold tracking-tight text-slate-200">
                  Create a workspace
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Set up your collaborative coding room.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-md border border-slate-800 bg-slate-900/70 px-2 py-1 text-[10px] font-medium text-slate-500">
              {step}/2
            </span>
          </div>

          {/* Step indicator */}
          <div className="mt-5 flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                "bg-indigo-600 text-white",
              )}
            >
              {step > 1 ? <Check size={14} /> : "1"}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-xs font-medium",
                  step === 1 ? "text-slate-200" : "text-slate-500",
                )}
              >
                Room details
              </p>
            </div>

            <div
              className={cn(
                "h-px w-10 shrink-0 sm:w-16",
                step === 2 ? "bg-indigo-500/60" : "bg-slate-800",
              )}
            />

            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                step === 2
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-800 bg-slate-900 text-slate-600",
              )}
            >
              2
            </div>

            <p
              className={cn(
                "text-xs font-medium",
                step === 2 ? "text-slate-200" : "text-slate-600",
              )}
            >
              <span className="hidden sm:inline">Project type</span>
              <span className="sm:hidden">Type</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="bg-slate-950/80 p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Room details
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Give your workspace a name and add some tags.
                </p>
              </div>

              <FieldGroup className="gap-5">
                {/* Room name */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="mb-2 text-xs font-medium text-slate-400"
                  >
                    Room name
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
                    placeholder="my-project"
                    autoComplete="off"
                    className="h-10 rounded-lg border-slate-800 bg-slate-900/60 text-sm text-slate-200 placeholder:text-slate-600 focus-visible:border-indigo-500/70 focus-visible:ring-indigo-500/20"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-600">
                    Use a unique name without spaces.
                  </p>

                  {errors.name && <FieldError>{errors.name[0]}</FieldError>}
                </Field>

                {/* Tags */}
                <Field>
                  <FieldLabel className="text-xs font-medium text-slate-400">
                    Tags
                    <span className="ml-1 font-normal text-slate-600">
                      (optional)
                    </span>
                  </FieldLabel>

                  {TAGS.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
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
                              "rounded-md border px-2 py-1 text-[11px] transition-colors",
                              selected
                                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                                : "border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700 hover:bg-slate-800 hover:text-slate-300",
                            )}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {errors.tags && <FieldError>{errors.tags[0]}</FieldError>}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="h-10 w-full rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500"
              >
                Continue
                <ArrowRight size={15} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">
                  Choose project type
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select the type of project you want to create.
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
                      onClick={() => {
                        setProjectType(type.value);

                        if (errors.projectType) {
                          setErrors((previous) => ({
                            ...previous,
                            projectType: undefined,
                          }));
                        }
                      }}
                      className={cn(
                        "group relative flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                        selected
                          ? "border-indigo-500/50 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          selected
                            ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                            : "border-slate-800 bg-slate-950/50 text-slate-500",
                        )}
                      >
                        <TypeIcon size={17} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-xs font-medium",
                            selected ? "text-slate-200" : "text-slate-300",
                          )}
                        >
                          {type.label}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-slate-600">
                          {type.description}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-indigo-500 bg-indigo-600 text-white"
                            : "border-slate-700 text-transparent",
                        )}
                      >
                        <Check size={10} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {errors.projectType && (
                <FieldError>{errors.projectType[0]}</FieldError>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-10 flex-1 rounded-lg border-slate-800 bg-slate-900/60 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                >
                  <ArrowLeft size={15} />
                  Back
                </Button>

                <Button
                  type="submit"
                  disabled={isPending || isNavigating}
                  className="h-10 flex-1 rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 disabled:opacity-60"
                >
                  {isPending || isNavigating ? (
                    <Spinner />
                  ) : (
                    <>
                      Create room
                      <Check size={15} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/80 bg-slate-900/20 px-5 py-3">
          <p className="text-center text-[11px] text-slate-600">
            Create a room. Invite your peers. Code together.
          </p>
        </div>
      </div>
    </form>
  );
}
