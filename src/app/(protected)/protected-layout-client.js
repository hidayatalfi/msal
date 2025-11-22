"use client";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function ProtectedLayoutClient({ children, user: serverUser }) {
  const { logout, user, refreshUser } = useAuth();
  useEffect(() => {
    if (serverUser && !user) {
      refreshUser();
    }
  }, [serverUser, user, refreshUser]);

  const currentUser = user || serverUser;
  return (
    <>
      <Navigation onClick={logout} />
      <main className="relative flex min-h-screen overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-orange-100 pb-5">
        {children}
      </main>
    </>
  );
}
