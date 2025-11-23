import { getServerAuth } from "@/lib/auth/server-auth";
import { redirect } from "next/navigation";
import ProtectedLayoutClient from "./protected-layout-client";

export default async function ProtectedLayout({ children }) {
  const { authenticated } = await getServerAuth();

  if (!authenticated) {
    redirect("/login");
  }

  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
