import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import VSCodeWindow from "@/components/auth/VSCodeWindow";

export const metadata: Metadata = {
  title: "Sign in | CodeSync",
  description: "Sign in to your CodeSync account and collaborate in real time.",
};

export default function LogInPage() {
  return (
    <VSCodeWindow activeFile="login.tsx">
      <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
        <LoginForm />
      </div>
    </VSCodeWindow>
  );
}
