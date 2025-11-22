import {
  formattedDateShortID,
  formattedDatetimeShortID,
} from "@/lib/formatDate";
import { formatRupiah } from "@/lib/formatRupiah";
import Link from "next/link";
import { FaFilePdf } from "react-icons/fa6";
export default function CardDocument({
  doc,
  setLoading,
  onDelete = () => {},
  setIdDelete,
}) {
  const handleDownload = async (id, filename) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/documents/${id}/download`);
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "Gagal download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "document.pdf";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setLoading(false);
    } catch (err) {
      console.error("Download error:", err);
      setLoading(false);
      // opsional: tampilkan toast/error message ke user
    }
  };
  return (
    <div className="relative flex h-fit w-full cursor-default flex-col space-x-3 rounded-xl border border-gray-100 bg-white/20 shadow-md shadow-gray-400/10 hover:border-blue-200 hover:bg-white/60 hover:shadow-blue-100">
      <div className="relative flex w-full space-x-5 p-3">
        <div className="relative flex w-full flex-col space-y-1 text-black">
          <div className="relative flex w-full items-center justify-between border-b border-white pb-3">
            <div className="relative flex w-full items-center space-x-3">
              <div className="relative w-fit rounded-full bg-blue-400 px-5 py-1 text-xs font-bold text-white">
                {doc.doc_type}
              </div>
              <p>{doc.doc_number}</p>
            </div>
            <div className="relative w-fit rounded-full bg-linear-to-br from-white/20 to-blue-400/20 px-5 py-1 text-xs font-bold text-blue-400 backdrop-blur-xs">
              {doc.company}
            </div>
          </div>
          <div className="relative flex w-full space-x-3">
            <div className="relative flex w-1/4 flex-col items-center justify-center border-b border-gray-300 py-3 text-center">
              <p className="font-medium">
                {doc.staff_date ? formattedDateShortID(doc.staff_date) : "-"}
              </p>
              <p className="text-sm">Verifikasi GA</p>
            </div>
            <div className="relative flex w-1/4 flex-col items-center justify-center border-b border-gray-300 py-3 text-center">
              <p className="font-medium">
                {doc.manager_date
                  ? formattedDateShortID(doc.manager_date)
                  : "-"}
              </p>
              <p className="text-sm">Diketahui Dept. Head</p>
            </div>
            <div className="relative flex w-1/4 flex-col items-center justify-center border-b border-gray-300 py-3 text-center">
              <p className="font-medium">
                {doc.director_date
                  ? formattedDateShortID(doc.director_date)
                  : "-"}
              </p>
              <p className="text-sm">Disetujui Direktur</p>
            </div>
            <div className="relative flex w-1/4 flex-col items-center justify-center border-b border-gray-300 py-3 text-center">
              <p className="font-medium">
                {doc.doc_type === "PDDO"
                  ? doc.finance_date
                    ? formattedDateShortID(doc.finance_date)
                    : "-"
                  : doc.purchasing_date
                    ? formattedDateShortID(doc.purchasing_date)
                    : "-"}
              </p>
              <p className="text-sm">
                Diserahkan ke
                {doc.doc_type === "PDDO" ? " Finance" : " Purchasing"}
              </p>
            </div>
          </div>
          {doc.doc_type === "PDDO" && (
            <div className="relative flex w-full space-x-3 py-1">
              <div className="relative flex w-1/2 flex-col space-x-3">
                <p className="text-sm">Nominal diajukan :</p>
                <p>{doc.submitted ? formatRupiah(doc.submitted) : 0}</p>
              </div>
              <span className="relative h-full w-0.5 bg-gray-200"></span>
              <div className="relative flex w-1/2 flex-col space-x-3">
                <p className="text-sm">Nominal Disetujui</p>
                <p>{doc.approved ? formatRupiah(doc.approved) : 0}</p>
              </div>
            </div>
          )}
          <div className="relative w-full border-b border-white p-3">
            <div className="relative flex w-full flex-col rounded-3xl bg-blue-400/10 px-5 py-3 text-blue-500">
              <p className="text-xs font-semibold">Catatan :</p>
              <p>{doc.doc_note ? doc.doc_note : "-"}</p>
            </div>
          </div>
          <div className="relative flex w-full items-center justify-between p-3">
            <div className="relative flex w-full items-center space-x-5">
              <div className="relative flex w-fit flex-col">
                <p className="text-xs text-gray-400">dibuat sistem</p>
                <p className="text-xs">
                  {formattedDatetimeShortID(doc.created_at)}
                </p>
              </div>
              <div className="relative flex w-fit flex-col">
                <p className="text-xs text-gray-400">terakhir update</p>
                <p className="text-xs">
                  {doc.updated_at
                    ? formattedDatetimeShortID(doc.updated_at)
                    : "-"}
                </p>
              </div>
            </div>
            <div className="relative flex w-fit items-center space-x-3">
              <button
                onClick={() =>
                  handleDownload(doc.unique_id_doc, doc.original_name)
                }
                className="flex cursor-pointer items-center rounded-full bg-purple-400 px-5 py-1 text-sm font-semibold text-white"
              >
                Download <FaFilePdf className="ml-2" />
              </button>
              <Link
                href={`/documents/edit?id=${doc.unique_id_doc}`}
                className="cursor-pointer rounded-full border border-blue-400 px-5 py-1 text-sm font-semibold text-blue-400"
              >
                Edit
              </Link>
              <button
                onClick={() => {
                  onDelete();
                  setIdDelete(doc.unique_id_doc);
                }}
                className="cursor-pointer rounded-full border border-red-400 px-5 py-1 text-sm font-semibold text-red-400"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
