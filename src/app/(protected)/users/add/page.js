import { hasRole } from "@/lib/auth/rbac-service";
import { getServerAuth } from "@/lib/auth/server-auth";
import { redirect } from "next/navigation";
import AddUserPageClient from "./AddUserPageClient";

export default async function AddUserPage() {
  const { authenticated, user } = await getServerAuth();

  if (!authenticated) {
    redirect("/login");
  }

  if (!hasRole(user, "admin")) {
    // bisa redirect ke halaman khusus unauthorized
    redirect("/404");
  }
  return <AddUserPageClient />;
}
