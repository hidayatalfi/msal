import { requireAuthWithRedirect } from "@/lib/auth/server-auth";
import AddDocumentClientPage from "./AddDocumentClientPage";
export default function AddDocumentPage() {
  const user = requireAuthWithRedirect();
  return <AddDocumentClientPage user={user} />;
}
