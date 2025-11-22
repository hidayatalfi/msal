import { requireAuthWithRedirect } from "@/lib/auth/server-auth";
import DocumentsClientPage from "./documents-client";
export default function DocumentsPage() {
  const user = requireAuthWithRedirect();
  return <DocumentsClientPage user={user} />;
}
