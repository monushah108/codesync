"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schema/form";

import {
  AlertCircle,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type FormErrors = Partial<Record<"email" | "password", string[]>>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const inputErrorClass = (field?: string[]) =>
    field
      ? "border-red-500/50 focus-visible:border-red-500/70 focus-visible:ring-red-500/10"
      : "border-[#303339]";

  const clearError = (field: keyof FormErrors) => {
    if (!errors[field]) return;

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  /* ---------------- EMAIL / PASSWORD LOGIN ---------------- */

  const handleLogin = async (formData: FormData) => {
    startTransition(async () => {
      const user = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      try {
        const { success, data, error } = signInSchema.safeParse(user);

        if (!success) {
          setErrors(error.flatten().fieldErrors);
          return;
        }

        setErrors({});

        await authClient.signIn.email(
          {
            ...data,
            callbackURL: "/dashboard",
          },
          {
            onSuccess() {
              router.push("/dashboard");
            },

            onError({ error }) {
              toast.error(error?.message || "An error occurred during login.");
            },
          },
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred during login.",
        );
      }
    });
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async () => {
    setSocialLoading("google");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      setSocialLoading(null);

      toast.error(
        error instanceof Error ? error.message : "Failed to login with Google.",
      );
    }
  };

  /* ---------------- GITHUB LOGIN ---------------- */

  const handleGithubLogin = async () => {
    setSocialLoading("github");

    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      setSocialLoading(null);

      toast.error(
        error instanceof Error ? error.message : "Failed to login with GitHub.",
      );
    }
  };

  return (
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      <div className="mx-auto w-full max-w-[440px]">
        <div className="overflow-hidden rounded-xl border border-[#2a2d32] bg-[#18191c] shadow-2xl shadow-black/30">
          {/* Header */}
          <div className="border-b border-[#292c31] bg-[#1b1c20] px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
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
                  Welcome back
                </h2>

                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  Sign in to continue to your workspace.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#18191c] p-5 sm:p-6">
            <form action={handleLogin}>
              <FieldGroup className="gap-5">
                {/* Social Login */}
                <Field>
                  <div className="grid grid-cols-2 gap-2">
                    {/* GitHub */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGithubLogin}
                      disabled={socialLoading !== null || isPending}
                      className={cn(
                        "h-10 rounded-lg border-[#303339]",
                        "bg-[#202126] text-xs text-slate-300",
                        "hover:border-[#41444a] hover:bg-[#25262b]",
                        "transition-all",
                      )}
                    >
                      {socialLoading === "github" ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </>
                      )}
                    </Button>

                    {/* Google */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={socialLoading !== null || isPending}
                      className={cn(
                        "h-10 rounded-lg border-[#303339]",
                        "bg-[#202126] text-xs text-slate-300",
                        "hover:border-[#41444a] hover:bg-[#25262b]",
                        "transition-all",
                      )}
                    >
                      {socialLoading === "google" ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                          >
                            <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867.0.307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="currentColor"
                            />
                          </svg>
                          Google
                        </>
                      )}
                    </Button>
                  </div>
                </Field>

                {/* Separator */}
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-[#292c31]" />

                  <span className="shrink-0 text-[10px] font-medium text-slate-600">
                    OR CONTINUE WITH EMAIL
                  </span>

                  <div className="h-px flex-1 bg-[#292c31]" />
                </div>

                {/* Email */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="mb-2 text-[11px] font-medium text-slate-400"
                  >
                    Email address
                  </FieldLabel>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearError("email");
                      }}
                      className={cn(
                        "h-10 rounded-lg bg-[#202126] pl-9 text-sm text-slate-200",
                        "placeholder:text-slate-600",
                        "transition-colors hover:border-[#3a3d43]",
                        "focus-visible:border-indigo-500/70",
                        "focus-visible:ring-2 focus-visible:ring-indigo-500/10",
                        inputErrorClass(errors.email),
                      )}
                    />
                  </div>

                  {errors.email && (
                    <FieldError className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email[0]}
                    </FieldError>
                  )}
                </Field>

                {/* Password */}
                <Field>
                  <div className="mb-2 flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-[11px] font-medium text-slate-400"
                    >
                      Password
                    </FieldLabel>

                    <Link
                      href="/auth/forgot-password"
                      className="text-[10px] text-slate-600 transition-colors hover:text-slate-300"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearError("password");
                      }}
                      className={cn(
                        "h-10 rounded-lg bg-[#202126] pl-9 pr-10 text-sm text-slate-200",
                        "placeholder:text-slate-600",
                        "transition-colors hover:border-[#3a3d43]",
                        "focus-visible:border-indigo-500/70",
                        "focus-visible:ring-2 focus-visible:ring-indigo-500/10",
                        inputErrorClass(errors.password),
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition-colors hover:text-slate-300"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <FieldError className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password[0]}
                    </FieldError>
                  )}
                </Field>

                {/* Submit */}
                <Field className="pt-1">
                  <Button
                    type="submit"
                    disabled={isPending || socialLoading !== null}
                    className="h-10 w-full rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-[#292c31] bg-[#1b1c20] px-5 py-3">
            <p className="text-center text-[10px] text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
