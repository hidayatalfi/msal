"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export function RequireRole({ roles, children, fallback = null }) {
  const { user, loading } = useAuth();

  if (loading) return null; // atau spinner kecil
  if (!user) return fallback || null;

  const userRoles = user.roles || [];
  const ok = roles.some((r) => userRoles.includes(r));

  if (!ok) return fallback || null;

  return children;
}
