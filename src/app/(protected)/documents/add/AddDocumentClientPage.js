"use client";
import { useEffect, useState } from "react";
import {
  FiUploadCloud,
  FiCheckCircle,
  FiAlertCircle,
  FiTrash,
} from "react-icons/fi";
import { FaRegFilePdf } from "react-icons/fa6";
import Button from "@/components/Button";
import { parseFileName } from "@/lib/parseFileName";
import Filter from "@/components/Filter";
import Notification from "@/components/Notification";
import Loading from "@/components/Loading";

export default function AddDocumentClientPage({ user }) {
  const typeList = ["SPP", "SPPA", "PDDO"];
  const companyList = ["MSAL", "MAPA", "PSAM", "PEAK", "WCJU", "KPP"];
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docNumber, setDocNumber] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [dateStaff, setDateStaff] = useState("");
  const [dateManager, setDateManager] = useState("");
  const [dateDirector, setDateDirector] = useState("");
  const [dateFinance, setDateFinance] = useState("");
  const [datePurchasing, setDatePurchasing] = useState("");
  const [nominalDiajukan, setNominalDiajukan] = useState(0);
  const [nominalDisetujui, setNominalDisetujui] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const result = parseFileName(fileName);
    setDocNumber(result.nomor.toUpperCase());
    setType(
      typeList.includes(result.jenis.toUpperCase())
        ? result.jenis.toUpperCase()
        : "",
    );
    setCompany(
      companyList.includes(result.perusahaan.toUpperCase())
        ? result.perusahaan.toUpperCase()
        : "",
    );
  }, [fileName]);

  const uploadToOfficeAndSaveMeta = async (file) => {
    try {
      setUploading(true);
      setError("");

      const uploadPdfWithPresign = async () => {
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

      const saveRes = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storedKey: info.storedKey,
          originalName: info.originalName,
          size: info.size,
          mime: info.mime,
          docNumber,
          type,
          company,
          dateStaff,
          dateManager,
          dateDirector,
          dateFinance,
          datePurchasing,
          nominalDiajukan,
          nominalDisetujui,
          note,
        }),
      });

      if (!saveRes.ok) {
        // 3a) Jika gagal simpan ke DB, hapus objek di R2 sebagai cleanup
        try {
          await fetch("/api/uploads/r2-object", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: info.storedKey }),
          });
        } catch (cleanupErr) {
          console.error("Failed to cleanup R2 object:", cleanupErr);
        }
        const text = await saveRes.text().catch(() => "");
        throw new Error("Save metadata failed: " + text);
      }

      setUploaded(true);
      setTimeout(() => setUploaded(false), 2500);
    } catch (e) {
      setError(e?.message || "Upload error");
      console.log("Error upload: ", e.message);
      setUploaded(false);
      setFileName("");
      setFile("");
    } finally {
      setUploading(false);
      setFile("");
      setFileName("");
      setDocNumber("");
      setType("");
      setCompany("");
      setDateStaff("");
      setDateManager("");
      setDateDirector("");
      setDateFinance("");
      setDatePurchasing("");
      setNominalDiajukan(0);
      setNominalDisetujui(0);
      setNote("");
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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

  const [errorUpload, setErrorUpload] = useState(false);

  const handleSave = () => {
    setErrorUpload(false);
    if (file && docNumber && type && company) {
      uploadToOfficeAndSaveMeta(file);
    } else {
      setErrorUpload(true);
    }
  };

  return (
    <>
      <div className="relative flex h-[97vh] w-full items-center justify-center space-x-5 px-8 pt-32 pb-5">
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

        <div className="relative h-full w-3/5 rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <h3 className="font-bold">Data Dokumen</h3>
          {file ? (
            <div className="relative flex h-full w-full flex-col pb-5">
              <div className="relative flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto pr-3 pb-3">
                <div className="relative flex w-full flex-col">
                  <p>Nama Dokumen Asli</p>
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
                  <div className="relative flex w-fit space-x-3">
                    <Filter
                      filterData={typeList}
                      filter={type}
                      setFilter={setType}
                    />
                  </div>
                </div>
                <div className="relative flex w-fit flex-col">
                  <p>Perusahaan</p>
                  <div className="relative flex w-fit space-x-3">
                    <Filter
                      filterData={companyList}
                      filter={company}
                      setFilter={setCompany}
                    />
                  </div>
                </div>
                {!typeList.includes(type) ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <p>Silahkan tentukan jenis dokumen.</p>
                  </div>
                ) : type === "PDDO" ? (
                  <>
                    <div className="relative flex w-full space-x-3">
                      <div className="relative flex w-fit flex-col">
                        <p>Verifikasi PIC GA</p>
                        <input
                          type="date"
                          value={dateStaff}
                          onChange={(e) => setDateStaff(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Diketahui Dept. Head</p>
                        <input
                          type="date"
                          value={dateManager}
                          onChange={(e) => setDateManager(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Disetujui Direktur</p>
                        <input
                          type="date"
                          value={dateDirector}
                          onChange={(e) => setDateDirector(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Diserahkan ke Finance</p>
                        <input
                          type="date"
                          value={dateFinance}
                          onChange={(e) => setDateFinance(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                    </div>
                    <div className="relative flex w-full space-x-3">
                      <div className="relative flex w-1/2 flex-col">
                        <p>Nominal Diajukan</p>
                        <input
                          type="number"
                          value={nominalDiajukan}
                          onChange={(e) => setNominalDiajukan(e.target.value)}
                          min={0}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-1/2 flex-col">
                        <p>Nominal Disetujui</p>
                        <input
                          type="number"
                          value={nominalDisetujui}
                          onChange={(e) => setNominalDisetujui(e.target.value)}
                          min={0}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                    </div>
                    <div className="relative flex w-full flex-col">
                      <p>Catatan</p>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative flex w-full space-x-3">
                      <div className="relative flex w-fit flex-col">
                        <p>Verifikasi PIC GA</p>
                        <input
                          type="date"
                          value={dateStaff}
                          onChange={(e) => setDateStaff(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Diketahui Dept. Head</p>
                        <input
                          type="date"
                          value={dateManager}
                          onChange={(e) => setDateManager(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Disetujui Direktur</p>
                        <input
                          type="date"
                          value={dateDirector}
                          onChange={(e) => setDateDirector(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                      <div className="relative flex w-fit flex-col">
                        <p>Diserahkan ke Finance</p>
                        <input
                          type="date"
                          value={datePurchasing}
                          onChange={(e) => setDatePurchasing(e.target.value)}
                          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                        />
                      </div>
                    </div>
                    <div className="relative flex w-full flex-col">
                      <p>Catatan</p>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
                      />
                    </div>
                  </>
                )}
              </div>
              <Button
                text="Save & Upload"
                onClick={handleSave}
                width="w-full"
                disabled={uploading}
              />
            </div>
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center space-y-3">
              <FaRegFilePdf className="text-6xl text-gray-500/40" />
              <p className="text-sm text-gray-400">
                Silahkan upload file SPP / SPPA / PDDO (PDF ≤10MB)
              </p>
            </div>
          )}
        </div>
      </div>
      {errorUpload && (
        <Notification
          title="Priiiiiiitttt!"
          message="Pastikan file pdf nomor, jenis, dan perusahaan di isi"
          onClose={() => setErrorUpload(false)}
          warning
        />
      )}
      {uploading && <Loading />}
    </>
  );
}
