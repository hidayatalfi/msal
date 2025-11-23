import EditDocumentClientPage from "./edit-document-client";
import NotFound from "@/app/not-found";
export default async function EditDocumentPage({ searchParams }) {
  const { id } = await searchParams;
  if (!id) {
    NotFound();
  }
  return <EditDocumentClientPage id={id} />;
}
