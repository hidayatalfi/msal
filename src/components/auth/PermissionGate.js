"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export function PermissionGate({ permissions, children, fallback = null }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return fallback;

  const userPerms = user.permissions || [];
  const ok = permissions.some((p) => userPerms.includes(p));

  if (!ok) return fallback;

  return children;
}
