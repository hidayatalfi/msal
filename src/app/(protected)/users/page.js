import { hasRole } from "@/lib/auth/rbac-service";
import { getServerAuth } from "@/lib/auth/server-auth";
import { redirect } from "next/navigation";
import UserPageClient from "./UserPageClient";

export default async function UsersPage() {
  const { authenticated, user } = await getServerAuth();

  if (!authenticated) {
    redirect("/login");
  }

  if (!hasRole(user, "admin")) {
    // bisa redirect ke halaman khusus unauthorized
    redirect("/404");
  }
  return <UserPageClient />;
}
