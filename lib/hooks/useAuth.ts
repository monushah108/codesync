import { useEffect } from "react";
import { authClient, useSession } from "../auth-client";
import { useCodestore } from "../store/Codestore";

export function useAuth() {
  const { data: session, isPending } = useSession();

  const setUser = useCodestore((state) => state.setUser);

  const user = session?.user ?? null;

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  const logout = async () => {
    await authClient.signOut();
  };

  return {
    user,
    session,
    isPending,
    logout,
  };
}
