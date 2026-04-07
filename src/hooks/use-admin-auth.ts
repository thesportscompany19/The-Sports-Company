"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout as authLogout, type AdminSession } from "@/lib/admin-auth";

export function useAdminAuth(requireAuth = true) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
    if (requireAuth && !s) {
      router.replace("/admin/login");
    }
  }, [requireAuth, router]);

  function logout() {
    authLogout();
    router.replace("/admin/login");
  }

  return { session, loading, logout };
}
