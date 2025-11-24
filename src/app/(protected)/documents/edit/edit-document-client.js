"use client";

import Button from "@/components/Button";
import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash,
} from "react-icons/fi";
import { FaRegFilePdf } from "react-icons/fa6";

export default function EditDocumentClientPage({ user, id }) {
  const router = useRouter();
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docNumber, setDocNumber] = useState("");
  const companyList = ["MSAL", "MAPA", "PSAM", "PEAK", "WCJU", "KPP"];
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [managerDate, setManagerDate] = useState("");
  const [directorDate, setDirectorDate] = useState("");
  const [financeDate, setFinanceDate] = useState("");
  const [purchasingDate, setPurchasingDate] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [approved, setApproved] = useState("");
  const [note, setNote] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setUploaded(false);
      setFileName("");
      setFile("");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Max file size is 10MB.");
      setUploaded(false);
      setFileName("");
      setFile("");
      return;
    }
    setError("");
    setFileName(file.name);
    setFile(file);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  useEffect(() => {
    let aborted = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/documents/edit?id=${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          },
        );
        if (!res.ok) {
          router.replace("/not-found"); // 404 atau rute khusus
          return;
        }
        const result = await res.json();
        if (!aborted) {
          if (!result) {
            router.replace("/not-found");
            return;
          }
          setDocument(result.data);
        }
      } catch {
        router.replace("/not-found");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [id, router]);

  useEffect(() => {
    if (document.length > 0) {
      document.map((item) => {
        setDocNumber(item.doc_number);
        setType(item.doc_type);
        setCompany(item.company);
        if (item.staff_date) {
          const staff = new Date(item.staff_date).toISOString().split("T")[0];
          setStaffDate(staff);
        }
        if (item.manager_date) {
          const manager = new Date(item.manager_date)
            .toISOString()
            .split("T")[0];
          setManagerDate(manager);
        }
        if (item.director_date) {
          const director = new Date(item.director_date)
            .toISOString()
            .split("T")[0];
          setDirectorDate(director);
        }
        if (item.finance_date) {
          const finance = new Date(item.finance_date)
            .toISOString()
            .split("T")[0];
          setFinanceDate(finance);
        }
        if (item.purchasing_date) {
          const purchasing = new Date(item.purchasing_date)
            .toISOString()
            .split("T")[0];
          setPurchasingDate(purchasing);
        }
        setNote(item.note);
        setSubmitted(Number(item.submitted).toString());
        setApproved(Number(item.approved).toString());
      });
    }
  }, [document]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      let storedKey = "";
      let originalName = "";
      let size = "";
      let mime = "";
      if (file) {
        const uploadPdfWithPresign = async () => {
          setUploading(true);
          // 1) Minta presigned URL
          const presignRes = await fetch("/api/uploads/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contentType: file.type,
              size: file.size,
              originalName: file.name,
            }),
          });

          if (!presignRes.ok) {
            const text = await presignRes.text();
            throw new Error("Presign failed: " + text);
          }

          const { url, key } = await presignRes.json();

          // 2) Upload ke R2 via presigned URL
          const putRes = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": file.type, // HARUS sama dengan contentType saat presign
            },
            body: file,
          });

          if (!putRes.ok) {
            const text = await putRes.text().catch(() => "");
            throw new Error("Upload to R2 failed: " + text);
          }

          // 3) Return info untuk disimpan ke DB
          return {
            storedKey: key,
            originalName: file.name,
            size: file.size,
            mime: file.type,
          };
        };

        const info = await uploadPdfWithPresign(file);
        storedKey = info.storedKey;
        originalName = info.originalName;
        size = info.size;
        mime = info.mime;

        setUploading(false);
      }
      const docs = {
        docNumber,
        company,
        staffDate,
        managerDate,
        directorDate,
        financeDate,
        purchasingDate,
        submitted,
        approved,
        note,
        unique_id_doc: id,
        file,
        originalName,
        size,
        mime,
        storedKey,
      };
      const res = await fetch("/api/documents/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docs),
      });

      if (file && !res.ok) {
        try {
          await fetch("/api/uploads/r2-object", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: storedKey }),
          });
        } catch (cleanupErr) {
          console.error("Failed to cleanup R2 object:", cleanupErr);
        }
        const text = await saveRes.text().catch(() => "");
        throw new Error("Save metadata failed: " + text);
      }
      const response = await res.json();
      if (response.status === 404) {
        setError("Gagal Update Database");
      } else {
        router.replace("/documents");
      }
    } catch (error) {
      setError("Terjadi kendala server");
      console.log("Error update: ", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="relative flex w-full justify-center space-x-5 pt-28 pb-5">
        <div className="relative h-full w-2/5 select-none">
          <label
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border bg-white/40 transition-all ${
              error
                ? "border-red-400/80"
                : dragActive
                  ? "scale-[1.03] border-blue-400/80"
                  : "border-white/60 hover:scale-[1.02]"
            } `}
          >
            <div className="relative mb-4 flex items-center justify-center">
              {error ? (
                <FiAlertCircle className="h-16 w-16 animate-pulse text-red-500" />
              ) : uploading ? (
                <FiUploadCloud className="h-16 w-16 animate-pulse text-blue-500" />
              ) : !uploaded ? (
                <FiUploadCloud
                  className={`h-16 w-16 ${dragActive ? "scale-110 text-blue-500" : "text-blue-400"}`}
                />
              ) : (
                <FiCheckCircle className="h-16 w-16 animate-bounce text-green-500" />
              )}
            </div>

            <div className="relative z-10 text-center">
              {error ? (
                <p className="text-lg font-semibold text-red-500">{error}</p>
              ) : uploading ? (
                <p className="text-lg font-semibold text-slate-700">
                  Mengunggah...
                </p>
              ) : !uploaded ? (
                <>
                  <p className="text-lg font-semibold text-slate-700">
                    {dragActive
                      ? "Drop your PDF here"
                      : "Drag & Drop or Click to Upload"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Only PDF up to 10MB supported
                  </p>
                </>
              ) : (
                <p className="text-lg font-semibold text-slate-700">
                  Uploaded: {fileName}
                </p>
              )}
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="relative flex h-full w-full max-w-3xl flex-col rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="relative flex h-full w-full flex-col space-y-5">
            {file && (
              <div className="relative flex w-full flex-col">
                <p>Nama Dokumen Baru</p>
                <div
                  className={`shadow-gray-400/10" relative flex h-fit w-full cursor-default items-center space-x-3 rounded-xl border border-gray-100 bg-white/20 shadow-md hover:border-blue-200 hover:bg-white/60 hover:shadow-blue-100`}
                >
                  <div className="relative flex w-full items-center space-x-3 p-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
                      <FaRegFilePdf className="text-2xl text-blue-400" />
                    </div>
                    <p>{fileName}</p>
                  </div>
                  <button
                    onClick={() => {
                      setFile("");
                      setFileName("");
                    }}
                    className={`relative flex h-full w-1/6 cursor-pointer items-center justify-center rounded-r-xl bg-red-400/10 text-lg hover:bg-red-400/60 hover:text-white`}
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            )}
            <div className="relative flex w-fit flex-col">
              <p>Nomor Dokumen</p>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
              />
            </div>
            <div className="relative flex w-fit flex-col">
              <p>Jenis Dokumen</p>
              <div className="relative flex w-fit items-center space-x-3">
                <div className="flex w-fit cursor-default items-center justify-center rounded-full border border-gray-300 bg-linear-to-r from-blue-400 to-purple-400 px-5 py-1 text-white">
                  <p className="text-sm">{type}</p>
                </div>
              </div>
            </div>
            <div className="relative flex w-fit flex-col">
              <p>Perusahaan</p>
              <div className="relative flex w-fit items-center space-x-3">
                <Filter
                  filterData={companyList}
                  filter={company}
                  setFilter={setCompany}
                />
              </div>
            </div>
            <div className="relative flex w-full space-x-3">
              <div className="relative flex w-fit flex-col">
                <label htmlFor="verifikasi">Verifikasi GA</label>
                <input
                  id="verifikasi"
                  type="date"
                  value={staffDate}
                  onChange={(e) => setStaffDate(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                />
              </div>
              <div className="relative flex w-fit flex-col">
                <label htmlFor="diketahui">Diketahui Dept. Head</label>
                <input
                  id="diketahui"
                  type="date"
                  value={managerDate}
                  onChange={(e) => setManagerDate(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                />
              </div>
              <div className="relative flex w-fit flex-col">
                <label htmlFor="disetujui">Disetujui Direktur</label>
                <input
                  id="disetujui"
                  type="date"
                  value={directorDate}
                  onChange={(e) => setDirectorDate(e.target.value)}
                  className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                />
              </div>
              {document[0]?.doc_type === "PDDO" || type === "PDDO" ? (
                <div className="relative flex w-fit flex-col">
                  <label htmlFor="disetujui">Diserahkan ke Finance</label>
                  <input
                    id="disetujui"
                    type="date"
                    value={financeDate}
                    onChange={(e) => setFinanceDate(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                  />
                </div>
              ) : (
                <div className="relative flex w-fit flex-col">
                  <label htmlFor="disetujui">Diserahkan ke Purchasing</label>
                  <input
                    id="disetujui"
                    type="date"
                    value={purchasingDate}
                    onChange={(e) => setPurchasingDate(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                  />
                </div>
              )}
            </div>
            {document[0]?.doc_type === "PDDO" && (
              <div className="relative flex w-full space-x-3">
                <div className="relative flex w-1/2 flex-col">
                  <p>Nominal Diajukan</p>
                  <input
                    type="number"
                    value={submitted}
                    onChange={(e) => setSubmitted(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                  />
                </div>
                <div className="relative flex w-1/2 flex-col">
                  <p>Nominal Disetujui</p>
                  <input
                    type="number"
                    value={approved}
                    onChange={(e) => setApproved(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
                  />
                </div>
              </div>
            )}
            <div className="relative flex w-full flex-col">
              <p>Catatan</p>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white/40 px-2 py-1 focus:outline-blue-400"
              />
            </div>
          </div>
          <Button text="Update" onClick={() => handleUpdate()} width="w-full" />
        </div>
      </div>
      {error && (
        <Notification
          onClose={() => setError("")}
          title="Upss, error!"
          message={error}
          warning
        />
      )}
      {loadingUpdate && <Loading />}
    </>
  );
}
