"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema } from "@/lib/schema/form";
import { authClient } from "@/lib/auth-client";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Code2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  X,
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
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const inputErrorClass = (field?: string[]) =>
    field
      ? "border-red-500/50 focus-visible:border-red-500/70 focus-visible:ring-red-500/10"
      : "border-[#303339]";

  /* ---------------- PASSWORD SECURITY ---------------- */

  const passwordChecks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;

  const passwordStrength =
    password.length === 0
      ? null
      : passwordScore <= 2
        ? {
            label: "Weak",
            width: "20%",
            className: "bg-red-500",
            text: "text-red-400",
          }
        : passwordScore === 3
          ? {
              label: "Fair",
              width: "45%",
              className: "bg-amber-500",
              text: "text-amber-400",
            }
          : passwordScore === 4
            ? {
                label: "Good",
                width: "70%",
                className: "bg-yellow-400",
                text: "text-yellow-400",
              }
            : {
                label: "Strong",
                width: "100%",
                className: "bg-emerald-500",
                text: "text-emerald-400",
              };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  /* ---------------- INPUT HELPERS ---------------- */

  const clearError = (field: keyof FormErrors) => {
    if (!errors[field]) return;

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async (formData: FormData) => {
    startTransition(async () => {
      const newUser = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
      };

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
            router.push("/dashboard");
          },

          onError: ({ error }) => {
            toast.error(error?.message || "Failed to create account");
          },
        },
      );
    });
  };

  /* ---------------- PASSWORD REQUIREMENT ---------------- */

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                  Create your account
                </h2>

                <p className="mt-1 text-[11px] leading-4 text-slate-500">
                  Join your workspace and start coding together.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#18191c] p-5 sm:p-6">
            <form action={handleSignup}>
              <FieldGroup className="gap-5">
                {/* Name */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="mb-2 text-[11px] font-medium text-slate-400"
                  >
                    Full name
                  </FieldLabel>

                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      clearError("name");
                    }}
                    className={cn(
                      "h-10 rounded-lg bg-[#202126] px-3 text-sm text-slate-200",
                      "placeholder:text-slate-600",
                      "transition-colors hover:border-[#3a3d43]",
                      "focus-visible:border-indigo-500/70",
                      "focus-visible:ring-2 focus-visible:ring-indigo-500/10",
                      inputErrorClass(errors.name),
                    )}
                  />

                  {errors.name ? (
                    <FieldError className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name[0]}
                    </FieldError>
                  ) : (
                    <FieldDescription className="mt-1.5 text-[10px] text-slate-600">
                      This is how your name will appear to collaborators.
                    </FieldDescription>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="mb-2 text-[11px] font-medium text-slate-400"
                  >
                    Email address
                  </FieldLabel>

                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      clearError("email");
                    }}
                    className={cn(
                      "h-10 rounded-lg bg-[#202126] px-3 text-sm text-slate-200",
                      "placeholder:text-slate-600",
                      "transition-colors hover:border-[#3a3d43]",
                      "focus-visible:border-indigo-500/70",
                      "focus-visible:ring-2 focus-visible:ring-indigo-500/10",
                      inputErrorClass(errors.email),
                    )}
                  />

                  {errors.email ? (
                    <FieldError className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email[0]}
                    </FieldError>
                  ) : (
                    <FieldDescription className="mt-1.5 text-[10px] text-slate-600">
                      Use an email you can access.
                    </FieldDescription>
                  )}
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="mb-2 text-[11px] font-medium text-slate-400"
                  >
                    Password
                  </FieldLabel>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
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

                  {/* Password security */}
                  {password.length > 0 && (
                    <div className="mt-3 rounded-lg border border-[#292c31] bg-[#1d1e22] p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />

                          <span className="text-[10px] font-medium text-slate-400">
                            Password security
                          </span>
                        </div>

                        {passwordStrength && (
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              passwordStrength.text,
                            )}
                          >
                            {passwordStrength.label}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3].map((segment) => {
                          const active =
                            passwordScore >= Math.ceil((segment + 1) * 1.25);

                          return (
                            <div
                              key={segment}
                              className="h-1 flex-1 overflow-hidden rounded-full bg-[#303339]"
                            >
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-300",
                                  active && passwordStrength?.className,
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                        <PasswordRequirement checked={passwordChecks.length}>
                          8+ characters
                        </PasswordRequirement>

                        <PasswordRequirement checked={passwordChecks.uppercase}>
                          Uppercase letter
                        </PasswordRequirement>

                        <PasswordRequirement checked={passwordChecks.lowercase}>
                          Lowercase letter
                        </PasswordRequirement>

                        <PasswordRequirement checked={passwordChecks.number}>
                          Number
                        </PasswordRequirement>

                        <PasswordRequirement checked={passwordChecks.special}>
                          Special character
                        </PasswordRequirement>
                      </div>
                    </div>
                  )}

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
                    className="h-10 w-full rounded-lg bg-indigo-600 text-xs font-medium text-white shadow-lg shadow-indigo-600/10 transition-all hover:bg-indigo-500 active:scale-[0.99]"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Spinner className="h-4 w-4" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>

                  <FieldDescription className="mt-3 text-center text-[10px] text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="font-medium text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-200"
                    >
                      Log in
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-[#292c31] bg-[#1b1c20] px-5 py-3">
            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-slate-600" />

              <p className="text-center text-[10px] text-slate-600">
                Your account credentials are securely protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({
  checked,
  children,
}: {
  checked: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[10px] transition-colors",
        checked ? "text-emerald-400" : "text-slate-600",
      )}
    >
      {checked ? (
        <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
      ) : (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      )}

      <span>{children}</span>
    </div>
  );
}
