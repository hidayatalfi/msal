import { requireAuthWithRedirect } from "@/lib/auth/server-auth";
import React from "react";
import LettersPageClient from "./letters-page-client";

export default function LettersPage() {
  const user = requireAuthWithRedirect();
  return <LettersPageClient user={user} />;
}
