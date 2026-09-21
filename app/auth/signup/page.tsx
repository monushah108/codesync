import { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your free CodeSync account and start collaborative coding.",
};

export default function SignupPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4] font-sans antialiased select-text">


      <div className="relative flex flex-1 min-h-0 w-full overflow-hidden">



        <div className="flex-1 min-h-0 overflow-y-auto bg-[#1e1e1e]">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-6">
            <SignupForm />
          </div>
        </div>

      </div>
    </div>

  );
}
