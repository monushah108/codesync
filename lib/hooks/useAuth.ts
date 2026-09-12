"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "../auth-client";
import { useCodestore } from "../store/Codestore";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const setUser = useCodestore((state) => state.setUser);

  const user = session?.user ?? null;

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

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
    logout,
  };
}
