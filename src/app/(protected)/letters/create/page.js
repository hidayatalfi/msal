import { requireAuthWithRedirect } from "@/lib/auth/server-auth";
import CreateLetterPageClient from "./create-letter-client";

export default function CreateLetterPage() {
  const user = requireAuthWithRedirect();
  return <CreateLetterPageClient user={user} />;
}
