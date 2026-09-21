"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/schema/form";
import { authClient } from "@/lib/auth-client";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Play,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Spinner } from "./ui/spinner";

type FormErrors = Partial<
  Record<"name" | "email" | "password" | "confirmPassword", string[]>
>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  /* ---------------- PASSWORD STRENGTH ---------------- */
  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 5 && password.length <= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength = useMemo(() => {
    if (password.length === 0) return null;
    if (passwordScore <= 2)
      return { label: "Fair", width: "35%", color: "bg-[#f59e0b]", text: "text-[#f59e0b]" };
    if (passwordScore <= 4)
      return { label: "Good", width: "70%", color: "bg-[#3794ff]", text: "text-[#3794ff]" };
    return { label: "Strong", width: "100%", color: "bg-[#89d185]", text: "text-[#89d185]" };
  }, [passwordScore, password.length]);

  /* ---------------- SOCIAL LOGIN ---------------- */
  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      setSocialLoading(null);
      toast.error(
        error instanceof Error ? error.message : `Failed to sign up with ${provider}.`,
      );
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: ["Passwords do not match."],
      }));
      return;
    }

    startTransition(async () => {
      const newUser = { name, email, password };

      try {
        const { success, data, error } = signUpSchema.safeParse(newUser);

        if (!success) {
          setErrors(error.flatten().fieldErrors);
          return;
        }

        setErrors({});

        await authClient.signUp.email(
          {
            ...data,
            image: `https://api.dicebear.com/9.x/lorelei/png?seed=${crypto.randomUUID()}`,
            callbackURL: "/dashboard",
          },
          {
            onSuccess: () => {
              toast.success("Account created successfully. Welcome to CodeSync!");
              router.push("/dashboard");
            },
            onError: ({ error }) => {
              toast.error(error?.message || "Failed to create account.");
            },
          },
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during signup.",
        );
      }
    });
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto py-6 px-3 sm:px-6 font-mono text-xs",
        className
      )}
      {...props}
    >
      {/* ── Outer VS Code Editor Canvas ── */}
      <div className="rounded-md border border-[#2d2d30] bg-[#1e1e1e] shadow-2xl shadow-black/80 overflow-hidden">
        {/* Editor File Title Bar */}
        <div className="flex h-8 items-center justify-between border-b border-[#2d2d30] bg-[#252526] px-3 font-sans text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#3794ff] font-bold">
              TSX
            </span>
            <span className="text-[#cccccc] font-medium">signup.tsx</span>
            <span className="text-[#858585] text-[11px]">— Developer Registration</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-[#858585] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#89d185]" />
            <span>Ready</span>
          </div>
        </div>

        {/* Code Content Buffer */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Syntax Highlighted Comments */}
          <div className="space-y-1 font-mono text-[11px] sm:text-xs text-[#6a9955] select-none border-b border-[#2d2d30] pb-3">
            <p>/**</p>
            <p className="pl-4">
              * <span className="text-[#569cd6]">@module</span> CodeSync/Registration
            </p>
            <p className="pl-4">
              * <span className="text-[#569cd6]">@description</span> Create free developer account & join collaborative workspaces.
            </p>
            <p className="pl-4">
              * <span className="text-[#569cd6]">@access</span> Public / Community Tier (Free Forever)
            </p>
            <p>*/</p>
          </div>

          {/* Code Import Prologue */}
          <div className="font-mono text-xs leading-relaxed select-none space-y-0.5 text-[#d4d4d4]">
            <p>
              <span className="text-[#c586c0]">import</span>{" "}
              <span className="text-[#9cdcfe]">&#123; createAccount &#125;</span>{" "}
              <span className="text-[#c586c0]">from</span>{" "}
              <span className="text-[#ce9178]">&quot;@codesync/auth&quot;</span>;
            </p>
            <p className="text-[#858585]">
              <span className="text-[#569cd6]">export default async function</span>{" "}
              <span className="text-[#dcdcaa]">RegisterAccount</span>() &#123;
            </p>
          </div>

          {/* ── Social OAuth Provider Badges ── */}
          <div className="pl-2 sm:pl-4 space-y-2 pt-1">
            <p className="font-mono text-[11px] text-[#6a9955] select-none">
              // Instant OAuth Registration Handshake
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                disabled={socialLoading !== null || isPending}
                className="group flex items-center justify-center gap-2 h-9 px-3 rounded bg-[#252526] hover:bg-[#2d2d30] border border-[#3c3c3c] hover:border-[#007acc] text-[#cccccc] hover:text-white transition-all text-xs font-mono disabled:opacity-50"
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
                    <span>$ signup github</span>
                  </>
                )}
              </button>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={socialLoading !== null || isPending}
                className="group flex items-center justify-center gap-2 h-9 px-3 rounded bg-[#252526] hover:bg-[#2d2d30] border border-[#3c3c3c] hover:border-[#007acc] text-[#cccccc] hover:text-white transition-all text-xs font-mono disabled:opacity-50"
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
                    <span>$ signup google</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider Comment */}
          <div className="pl-2 sm:pl-4 text-[11px] text-[#6a9955] select-none pt-1">
            // Or register with developer email & credentials
          </div>

          {/* ── Main Form Inputs ── */}
          <form onSubmit={handleSignup} className="pl-2 sm:pl-4 space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="font-mono text-[#9cdcfe] flex items-center gap-1 text-[11px]"
              >
                <span className="text-[#569cd6]">const</span> developerName:{" "}
                <span className="text-[#4ec9b0]">string</span> =
              </label>

              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder='"Alex Doe" // 4-10 characters'
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  className={cn(
                    "h-9 rounded-sm bg-[#252526] px-3 font-mono text-xs text-[#ce9178] placeholder:text-[#5a5a5a] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
                    errors.name && "border-[#f14c4c] focus-visible:border-[#f14c4c]"
                  )}
                />
              </div>

              {errors.name && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#f14c4c] bg-[#2d1517] p-1.5 rounded border border-[#5a1d1d]">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.name[0]}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="font-mono text-[#9cdcfe] flex items-center gap-1 text-[11px]"
              >
                <span className="text-[#569cd6]">const</span> email:{" "}
                <span className="text-[#4ec9b0]">string</span> =
              </label>

              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder='"developer@company.com"'
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={cn(
                    "h-9 rounded-sm bg-[#252526] px-3 font-mono text-xs text-[#ce9178] placeholder:text-[#5a5a5a] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
                    errors.email && "border-[#f14c4c] focus-visible:border-[#f14c4c]"
                  )}
                />
              </div>

              {errors.email && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#f14c4c] bg-[#2d1517] p-1.5 rounded border border-[#5a1d1d]">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.email[0]}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="font-mono text-[#9cdcfe] flex items-center gap-1 text-[11px]"
              >
                <span className="text-[#569cd6]">const</span> secretKey:{" "}
                <span className="text-[#4ec9b0]">string</span> =
              </label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                  }}
                  placeholder='"••••••••" // 5-8 chars'
                  className={cn(
                    "h-9 rounded-sm bg-[#252526] pl-3 pr-10 font-mono text-xs text-[#ce9178] placeholder:text-[#5a5a5a] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
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

              {/* Password complexity diagnostic bar */}
              {password.length > 0 && passwordStrength && (
                <div className="mt-2 space-y-1 bg-[#252526] p-2 rounded border border-[#3c3c3c]">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#858585]">// Linter Complexity Check</span>
                    <span className={cn("font-bold", passwordStrength.text)}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-[#181818] rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-300", passwordStrength.color)}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#f14c4c] bg-[#2d1517] p-1.5 rounded border border-[#5a1d1d]">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.password[0]}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="font-mono text-[#9cdcfe] flex items-center gap-1 text-[11px]"
              >
                <span className="text-[#569cd6]">const</span> confirmKey:{" "}
                <span className="text-[#4ec9b0]">string</span> =
              </label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearError("confirmPassword");
                  }}
                  placeholder='"••••••••"'
                  className={cn(
                    "h-9 rounded-sm bg-[#252526] pl-3 pr-10 font-mono text-xs text-[#ce9178] placeholder:text-[#5a5a5a] border border-[#3c3c3c] focus-visible:border-[#007acc] focus-visible:ring-1 focus-visible:ring-[#007acc] transition-all",
                    errors.confirmPassword && "border-[#f14c4c] focus-visible:border-[#f14c4c]"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#858585] hover:text-[#cccccc] transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-[#f14c4c] bg-[#2d1517] p-1.5 rounded border border-[#5a1d1d]">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  <span>{errors.confirmPassword[0]}</span>
                </div>
              )}
            </div>

            {/* ── Submit Command Execution ── */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending || socialLoading !== null}
                className="h-9 w-full rounded-sm bg-[#007acc] hover:bg-[#0062a3] text-white font-mono text-xs font-semibold shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Spinner className="h-3.5 w-3.5" />
                    <span>executing createAccount()...</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3 fill-current text-white" />
                    <span>run createAccount(&#123; name, email, password &#125;)</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Code Epilogue */}
          <div className="font-mono text-xs text-[#d4d4d4] select-none pt-2">
            <p>&#125;</p>
          </div>

          {/* ── Mini Interactive Terminal Output Footer ── */}
          <div className="rounded border border-[#2d2d30] bg-[#181818] p-3 text-[11px] font-mono space-y-1 text-[#858585] select-none">
            <div className="flex items-center gap-2 border-b border-[#2d2d30] pb-1.5 text-[10px] text-[#cccccc] font-sans">
              <Terminal className="size-3 text-[#007acc]" />
              <span className="font-semibold uppercase tracking-wider">Terminal Output</span>
              <span className="text-[#89d185] ml-auto">● Seed generator active</span>
            </div>
            <p className="text-[#89d185]">
              <span className="text-[#007acc]">user@codesync</span>:~$ codesync auth:register
            </p>
            <p className="text-[#cccccc]">
              ✓ Generating unique multiplayer avatar seed via Dicebear lorelei.
            </p>
            <p className="text-[#858585]">
              ✓ Granted free tier: unlimited rooms, Yjs sync, and AI Copilot access.
            </p>
          </div>

          {/* Switch Tab Prompt */}
          <div className="pt-3 border-t border-[#2d2d30] flex items-center justify-between text-xs text-[#858585]">
            <span>// Already have an account?</span>
            <Link
              href="/auth/login"
              className="text-[#3794ff] hover:underline flex items-center gap-1 font-mono font-medium"
            >
              <span>navigate(&quot;login.tsx&quot;)</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
