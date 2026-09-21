"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schema/form";

import {
  AlertCircle,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
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
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const clearError = (field: keyof FormErrors) => {
    if (!errors[field]) return;
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  /* ---------------- EMAIL / PASSWORD LOGIN ---------------- */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const user = { email, password };

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
              toast.success("Welcome back!");
              router.push("/dashboard");
            },
            onError({ error }) {
              toast.error(error?.message || "Invalid email or password.");
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
    <div className={cn("w-full", className)} {...props}>
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1017] p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/40 transition-colors">
        {/* Header */}
        <div className="mb-6 space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access your collaborative workspaces.
          </p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleGithubLogin}
            disabled={socialLoading !== null || isPending}
            className="h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all gap-2"
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
                  className="shrink-0"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={socialLoading !== null || isPending}
            className="h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all gap-2"
          >
            {socialLoading === "google" ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.88-3.05c-1.08.72-2.46 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.23v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24c-.25-.72-.39-1.49-.39-2.24s.14-1.52.39-2.24V6.61H1.23C.45 8.16 0 9.99 0 12s.45 3.84 1.23 5.39l4.04-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.23 6.61l4.04 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>
                <span>Google</span>
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-white/10" />
          </div>
          <span className="relative bg-white dark:bg-[#0c1017] px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Or continue with email
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin}>
          <FieldGroup className="gap-4">
            {/* Email Field */}
            <Field>
              <FieldLabel
                htmlFor="email"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block"
              >
                Email address
              </FieldLabel>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={cn(
                    "h-11 rounded-xl bg-slate-50 dark:bg-white/[0.04] pl-10 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-white/10 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all",
                    errors.email && "border-rose-500/70 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                  )}
                />
              </div>

              {errors.email && (
                <FieldError className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.email[0]}</span>
                </FieldError>
              )}
            </Field>

            {/* Password Field */}
            <Field>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </FieldLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder="••••••••"
                  className={cn(
                    "h-11 rounded-xl bg-slate-50 dark:bg-white/[0.04] pl-10 pr-11 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-white/10 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all",
                    errors.password && "border-rose-500/70 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <FieldError className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.password[0]}</span>
                </FieldError>
              )}
            </Field>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending || socialLoading !== null}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all gap-2 disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create account free
          </Link>
        </p>
      </div>
    </div>
  );
}
