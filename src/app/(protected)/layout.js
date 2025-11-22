import { requireAuth } from "@/lib/auth/server-auth";
import ProtectedLayoutClient from "./protected-layout-client";

export default async function ProtectedLayout({ children }) {
  // Server-side auth check - protect all children
  const user = await requireAuth();

  return <ProtectedLayoutClient user={user}>{children}</ProtectedLayoutClient>;
}
