"use client";
import { formattedDate, formattedDatetimeShortID } from "@/lib/formatDate";
import { IoDocumentText } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";

// export async function downloadViaNavigation(url) {
//   window.location.href = url; // satu-satunya trigger
// }

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

export default function CardLetter({
  letter,
  setLoading,
  onDelete = () => {},
  setIdDelete,
}) {
  const employee = JSON.parse(letter.employee);
  const handleGenerate = async () => {
    setLoading(true);
    let logo = "/logos/msal.png";
    if (letter.company_code === "MSAL") {
      logo = "/logos/msal.png";
    } else if (letter.company_code === "PSAM") {
      logo = "/logos/psam.png";
    } else if (letter.company_code === "MAPA") {
      logo = "/logos/mapa.png";
    } else if (letter.company_code === "PEAK") {
      logo = "/logos/peak.png";
    } else if (letter.company_code === "KPP") {
      logo = "/logos/kpp.png";
    } else if (letter.company_code === "WCJU") {
      logo = "/logos/wcju.png";
    } else if (letter.company_code === "GROUP") {
      logo = "/logos/msal.png";
    }

    const newLetter = {
      letterName: `${letter.letter_name} ${employee.name}`,
      type: letter.letter_type,
      companyName: letter.company_name,
      companyID: letter.company_code,
      letterNumber: letter.letter_number,
      letterDateDisplay: formattedDate(letter.letter_date),
      effectiveDateDisplay: formattedDate(letter.letter_date),
      letterDate: letter.letter_date,
      effectiveDate: letter.effective_date,
      city: letter.city,
      manager: letter.signature_name,
      position: letter.signature_position,
      logo,
      year: letter.year,
      letterCode: letter.letter_code,
      letterDept: letter.letter_dept,
      serial: String(letter.serial_number).padStart(3, "0"),
      employee,
    };
    const q = new URLSearchParams({
      data: encodeURIComponent(JSON.stringify([newLetter])),
    }).toString();
    const url = `/api/letters/generate?${q}`;
    const filename = `${letter.letter_name + " " + employee.name || "surat"}.pdf`;
    try {
      await downloadViaBlob(process.env.NEXT_PUBLIC_APP_URL + url, filename); // tetap di halaman
    } catch (e) {
      console.log("Error from generate: ", e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`shadow-gray-400/10" relative flex h-fit w-full cursor-default flex-col items-center space-x-3 rounded-xl border border-gray-100 bg-white/20 shadow-md hover:border-blue-200 hover:bg-white/60 hover:shadow-blue-100`}
    >
      <div className="relative flex w-full items-center justify-center space-x-3 p-3">
        <div
          className={`relative m-3 flex aspect-square w-12 items-center justify-center rounded-full bg-white/50`}
        >
          <IoDocumentText className="text-xl text-blue-400" />
        </div>
        <div className="relative flex w-full flex-col py-3 text-start">
          <p className="text-sm font-bold uppercase">
            SURAT KEPUTUSAN {letter.letter_type + " " + employee.name}
          </p>
          <p>{letter.letter_number}</p>
        </div>
        <div className="relative h-fit w-fit rounded-xl bg-linear-to-br from-white/40 to-blue-100 px-5 py-2 text-sm font-semibold text-blue-400 backdrop-blur-md">
          {letter.company_code}
        </div>
      </div>
      <div className="relative flex w-full items-center justify-between border-t border-white hover:border-slate-200">
        <div className="relatie flex w-fit items-center justify-center space-x-3 px-3">
          <button
            onClick={handleGenerate}
            className="flex cursor-pointer items-center rounded-full bg-purple-400 px-5 py-1 text-sm font-semibold text-white"
          >
            Generate <FaFilePdf className="ml-2" />
          </button>
          <button
            onClick={() => {
              onDelete();
              setIdDelete(letter.unique_id_generated_letter);
            }}
            className="cursor-pointer rounded-full border border-red-400 px-5 py-1 text-sm font-semibold text-red-400"
          >
            Hapus
          </button>
        </div>
        <div className="relative flex w-60 flex-col items-center justify-center p-3 text-center">
          <p className="text-xs">dibuat sitem</p>
          <p className="text-sm font-medium">
            {formattedDatetimeShortID(letter.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
