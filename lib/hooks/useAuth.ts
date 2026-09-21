"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "../auth-client";
import { useCodestore } from "../store/Codestore";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useCodestore((state) => state.setUser);

  const is404 = (error as { status?: number } | null)?.status === 404;
  const user = is404 ? null : (session?.user ?? null);

  useEffect(() => {
    if (is404 || (!isPending && !session)) {
      setUser(null);
      // If status is 404 and user attempts to navigate away to protected routes, redirect back to home page
      if (
        pathname &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/playground"))
      ) {
        toast.error("Please sign in to continue");
        router.replace("/");
      }
    } else if (user) {
      setUser(user);
    }
  }, [user, session, isPending, is404, pathname, router, setUser]);

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);

      toast.success("Logged out successfully");
      router.replace("/");
    } catch (e) {
      const message = e instanceof Error ? e.message : "logout failed";
      toast.error(message);
    }
  };

  return {
    user,
    session,
    isPending,
    error,
    is404,
    logout,
  };
}
