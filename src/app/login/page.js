import Loading from "@/components/Loading";
import { Suspense } from "react";
import LoginPageClient from "./login-page-client";
import { getServerAuth } from "@/lib/auth/server-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const { authenticated } = await getServerAuth();

  if (authenticated) {
    // sudah login → langsung ke dashboard (atau route default lain)
    redirect("/home");
  }
  return (
    <Suspense fallback={<Loading />}>
      <LoginPageClient />
    </Suspense>
  );
}
