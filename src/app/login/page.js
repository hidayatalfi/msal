import Loading from "@/components/Loading";
import { Suspense } from "react";
import LoginPageClient from "./login-page-client";

export default function Login() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginPageClient />
    </Suspense>
  );
}
