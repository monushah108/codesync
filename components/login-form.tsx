"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schema/form";

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
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
              toast.success("Authentication successful. Welcome back!");
              router.push("/dashboard");
            },
            onError({ error }) {
              toast.error(error?.message || "Invalid credentials provided.");
            },
          },
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred during authentication.",
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
        error instanceof Error ? error.message : "Failed to sign in with Google.",
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
        error instanceof Error ? error.message : "Failed to sign in with GitHub.",
      );
    }
  };

  return (
    <div
      className={cn("w-full max-w-md mx-auto py-6 px-4 font-sans text-xs", className)}
      {...props}
    >
      <div className="rounded-lg border border-[#2d2d30] bg-[#252526]/80 backdrop-blur-md shadow-2xl p-5 sm:p-7 space-y-5">
        {/* Header */}
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#007acc]/20 text-[#007acc] border border-[#007acc]/30">
              <LockKeyhole className="size-4" />
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Sign in to CodeSync
            </h1>
          </div>
          <p className="text-xs text-[#858585]">
            Welcome back! Enter your developer credentials or sign in with OAuth.
          </p>
        </div>

        {/* Social OAuth Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* GitHub OAuth */}
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={socialLoading !== null || isPending}
            className="flex items-center justify-center gap-2 h-9 px-3 rounded bg-[#1e1e1e] hover:bg-[#2d2d30] border border-[#3c3c3c] hover:border-[#007acc] text-[#cccccc] hover:text-white transition-all text-xs font-medium disabled:opacity-50"
          >
            {socialLoading === "github" ? (
              <Spinner className="h-3.5 w-3.5 text-[#007acc]" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="shrink-0 text-white"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </>
            )}
          </button>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={socialLoading !== null || isPending}
            className="flex items-center justify-center gap-2 h-9 px-3 rounded bg-[#1e1e1e] hover:bg-[#2d2d30] border border-[#3c3c3c] hover:border-[#007acc] text-[#cccccc] hover:text-white transition-all text-xs font-medium disabled:opacity-50"
          >
            {socialLoading === "google" ? (
              <Spinner className="h-3.5 w-3.5 text-[#007acc]" />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0"
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
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#3c3c3c]" />
          <span className="relative px-3 text-[#252526] dark:text-[#b4b4b4] text-[10px] uppercase tracking-wider">
            <span className="bg-transparent px-3">•</span>
            <span className="px-3 bg-[#252526] dark:bg-[#252526]">or</span>
            <span className="bg-transparent px-3">•</span>
          </span>

          <div className="w-full border-t border-[#3c3c3c]" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="font-medium text-[#cccccc] block text-xs"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="developer@company.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              className={cn(
                "h-9 rounded bg-[#1e1e1e] px-3 font-mono text-xs text-[#ce9178] placeholder:text-[#555555] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
                errors.email && "border-[#f14c4c] focus-visible:border-[#f14c4c]"
              )}
            />
            {errors.email && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#f14c4c]">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.email[0]}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-medium text-[#cccccc] block text-xs"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-[#007acc] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
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
                  "h-9 rounded bg-[#1e1e1e] pl-3 pr-10 font-mono text-xs text-[#ce9178] placeholder:text-[#555555] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
                  errors.password && "border-[#f14c4c] focus-visible:border-[#f14c4c]"
                )}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#cccccc] transition-colors p-1"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {errors.password && (
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#f14c4c]">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{errors.password[0]}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending || socialLoading !== null}
              className="h-9 w-full rounded bg-[#007acc] hover:bg-[#0062a3] text-white text-xs font-semibold shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </div>
        </form>

        {/* Switch to Signup Link */}
        <div className="pt-2 border-t border-[#333333] flex items-center justify-between text-xs text-[#858585]">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/auth/signup"
            className="text-[#3794ff] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Sign up</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
