"use client";
import Button from "@/components/Button";
import FormAddLetter from "./FormAddLetter";
import { useState, useTransition } from "react";
import Notification from "@/components/Notification";
import Loading from "@/components/Loading";
import { IoDocumentText } from "react-icons/io5";
import { FiTrash } from "react-icons/fi";
import { generateLetterAction } from "@/lib/generateLetters";

export async function downloadViaNavigation(url) {
  window.location.href = url; // satu-satunya trigger
}

export async function downloadViaBlob(url, filename) {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Gagal mengambil file");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export default function CreateLetterPageClient({ user }) {
  const [isPending, startTransition] = useTransition();
  const [letterList, setLetterList] = useState([]);
  const [errorNotif, setErrorNotif] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preferExternalDownloader, setPreferExternalDownloader] = useState(
    () => {
      // baca preferensi dari localStorage atau default false
      try {
        return localStorage.getItem("preferExternalDownloader") === "1";
      } catch {
        return false;
      }
    },
  );
  const handleDeleteFromListLetter = (indexDelete) => {
    setLetterList((prevList) =>
      prevList.filter((_, index) => index !== indexDelete),
    );
  };
  const handleGenerate = () => {
    if (letterList.length <= 0) {
      setErrorNotif("Belum ada daftar surat");
    } else {
      startTransition(async () => {
        // 1) Simpan & alokasikan nomor di server, dapatkan URL endpoint file
        const res = await generateLetterAction(letterList);
        if (!res?.ok) return setErrorNotif(res?.error || "Gagal");

        // 2) Tentukan nama file unduhan
        const isBatch = res.url.includes("/api/letters/generate/batch");
        const filename = isBatch
          ? `paket-surat-${Date.now()}.zip`
          : `${letterList[0]?.letterName || "surat"}.pdf`;

        // 3) Ambil file sebagai Blob dan trigger download (tanpa buka tab)
        try {
          // if (preferExternalDownloader) {
          // await downloadViaNavigation(res.url); // IDM-friendly
          // } else {
          await downloadViaBlob(
            process.env.NEXT_PUBLIC_APP_URL + res.url,
            filename,
          ); // tetap di halaman
          // }
        } catch (e) {
          console.log("Error from create letter: ", e);
          setErrorNotif("Error Generate");
          // fallback otomatis jika mode utama gagal
          // if (!preferExternalDownloader) {
          // await downloadViaNavigation(res.url);
          // } else {
          // await downloadViaBlob(res.url, filename);
          // }
        } finally {
          setLetterList([]);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      });
    }
  };
  return (
    <>
      <div className="relative flex w-full space-x-5 px-5 pt-30 pb-5">
        <div className="relative flex h-fit w-[58%] flex-col space-y-3 rounded-xl bg-white/10 px-5 py-3 pb-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <FormAddLetter
            setErrorNotif={setErrorNotif}
            setLetterList={setLetterList}
            letterList={letterList}
          />
        </div>
        <div className="fixed right-5 flex h-[80vh] w-2/5 flex-col justify-between rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="relative flex w-full items-center justify-between">
            <h3 className="text-lg">Daftar Surat</h3>
            <p className="text-sm text-gray-500">
              Total Surat : {letterList.length}
            </p>
          </div>
          <div className="relative flex h-full w-full flex-col space-y-3 overflow-y-auto p-3">
            {letterList.length === 0 ? (
              <div className="relative w-full rounded-3xl bg-blue-400/10 px-5 py-3 text-blue-500">
                <p>
                  Belum ada data surat yang mau di generate, silahkan isi dan
                  tambah data dulu.
                </p>
              </div>
            ) : (
              <>
                <div className="relative w-full rounded-3xl bg-blue-400/10 px-5 py-3 text-blue-500">
                  <p>
                    Kamu bisa membuat surat maksimal hinggal 8 surat dalam
                    sekali generate.
                  </p>
                </div>
                {letterList.map((item, index) => (
                  <div
                    key={index}
                    className={`shadow-gray-400/10" relative flex h-18 w-full cursor-default space-x-3 rounded-xl border border-gray-100 bg-white/20 shadow-md hover:border-blue-200 hover:bg-white/60 hover:shadow-blue-100`}
                  >
                    <div
                      className={`relative m-3 flex aspect-square w-12 items-center justify-center rounded-full bg-white`}
                    >
                      <IoDocumentText className="text-xl text-blue-400" />
                    </div>
                    <div className="relative flex w-full flex-col py-3">
                      <p className="text-sm font-bold uppercase">
                        {item.letterName}
                      </p>
                      <p>{item.letterNumber}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFromListLetter(index)}
                      className={`relative flex h-full w-1/6 cursor-pointer items-center justify-center rounded-r-xl bg-red-400/10 text-lg hover:bg-red-400/60 hover:text-white`}
                    >
                      <FiTrash />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          <Button onClick={handleGenerate} width="w-full" text="Generate" />
        </div>
      </div>
      {errorNotif && (
        <Notification
          onClose={() => setErrorNotif(null)}
          title="Priiiiitttt!"
          message={errorNotif}
          warning
        />
      )}
      {isPending && <Loading />}
      {success && (
        <Notification
          onClose={() => setSuccess(false)}
          title="Yeayy!"
          message="Generate surat berhasil"
        />
      )}
    </>
  );
}
