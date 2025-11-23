"use client";
import Loading from "@/components/Loading";
import Navigation from "@/components/Navigation";
import { useState } from "react";

export default function ProtectedLayoutClient({ children }) {
  const [loading, setLoading] = useState(false);
  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setLoading(false);
    window.location.href = "/login";
  }
  return (
    <>
      <Navigation onClick={handleLogout} />
      <main className="relative flex min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-orange-100 pb-5">
        {children}
      </main>
      {loading && <Loading />}
    </>
  );
}
