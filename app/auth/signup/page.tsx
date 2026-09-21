import { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import VSCodeWindow from "@/components/auth/VSCodeWindow";

export const metadata: Metadata = {
  title: "Sign up | CodeSync",
  description: "Create your free CodeSync account and start collaborative coding.",
};

export default function SignupPage() {
  return (
    <VSCodeWindow activeFile="signup.tsx">
      <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
        <SignupForm />
      </div>
    </VSCodeWindow>
  );
}
