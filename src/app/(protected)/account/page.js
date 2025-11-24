import { getServerAuth } from "@/lib/auth/server-auth";
import AccountPageClient from "./AccountPageClient";

export default async function AccountPage() {
  const { user } = await getServerAuth();
  return <AccountPageClient user={user} />;
}
