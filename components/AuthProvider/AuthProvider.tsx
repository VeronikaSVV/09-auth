"use client";

import { useEffect, type ReactNode } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        if (await checkSession()) {
          const user = await getMe();
          if (active) setUser(user);
        } else if (active) {
          clearIsAuthenticated();
        }
      } catch {
        if (active) clearIsAuthenticated();
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [clearIsAuthenticated, setUser]);

  return children;
}
