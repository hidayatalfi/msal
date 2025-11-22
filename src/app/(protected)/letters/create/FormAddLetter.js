"use client";
import Button from "@/components/Button";
import Filter from "@/components/Filter";
import { formattedDate } from "@/lib/formatDate";
import { useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RiCloseCircleLine } from "react-icons/ri";
import { CgDanger } from "react-icons/cg";
import Select from "@/components/Select";

async function fetchNextLetterNumber(letterCode, letterDept, tanggalSurat) {
  const params = new URLSearchParams({
    letterCode,
    letterDept,
  });

  if (tanggalSurat) {
    params.set("date", tanggalSurat); // yyyy-mm-dd
  }

  const res = await fetch(`/api/letters/number?${params.toString()}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "Gagal mendapatkan nomor surat berikutnya");
  }

  return json.data;
}

async function findNextAvailableSerial({
  baseSerialFromList, // nomor terakhir di letterList (angka), misal 3
  letterCode,
  letterDept,
  year,
}) {
  let candidate = Number(baseSerialFromList) + 1; // mulai dari 4

  while (true) {
    const params = new URLSearchParams({
      letterCode,
      letterDept,
      year: String(year),
      serialNumber: String(candidate),
    });

    const res = await fetch(`/api/letters/check-number?${params.toString()}`);
    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.error || "Gagal cek nomor ke server");
    }

    if (json.available) {
      // ketemu nomor yang belum ada di DB
      return candidate;
    }

    candidate += 1; // kalau sudah ada di DB, coba nomor berikutnya
  }
}

export default function FormAddLetter({
  setLetterList,
  setErrorNotif,
  letterList,
}) {
  const typeLetterData = ["Promosi", "Mutasi", "Demosi"];
  const companyData = ["MSAL", "MAPA", "PSAM", "PEAK", "KPP", "WCJU", "GROUP"];
  const genderData = ["Laki-Laki", "Perempuan"];
  const [typeLetter, setTypeLetter] = useState("Promosi");
  const [company, setCompany] = useState("MSAL");
  const [gender, setGender] = useState("Laki-Laki");
  const [letterNumber, setLetterNumber] = useState("001");
  const [letterCode, setLetterCode] = useState("PROM");
  const [letterNumberDept, setLetterNumberDept] = useState("MSAL-HRO");
  const [letterNumberMonth, setLetterNumberMonth] = useState("");
  const [letterNumberYear, setLetterNumberYear] = useState("");
  const [letterDate, setLetterDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [city, setCity] = useState("Jakarta");
  const [manager, setManager] = useState("Yoga Sapta");
  const [position, setPosition] = useState("HROps Dept Head");
  const [employeeName, setEmployeName] = useState("");
  const [lastPosition, setLastPosition] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [lastDepartment, setLastDepartment] = useState("");
  const [currentDepartment, setCurrentDepartment] = useState("");
  const [lastLocation, setLastLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [lastCompany, setLastCompany] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [lastRank, setLastRank] = useState("");
  const [currentRank, setCurrentRank] = useState("");
  const [lastStatus, setLastStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [loadingNumber, setLoadingNumber] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchNextLetterNumber(letterCode, letterNumberDept);
      setLetterNumber(data.serialDisplay);
      setLetterNumberMonth(data.monthRoman);
      setLetterNumberYear(data.year);
    };
    fetchData();

    const today = new Date();
    const formatted = today.toISOString().split("T")[0];

    setLetterDate(formatted);
    setEffectiveDate(formatted);
  }, []);

  useEffect(() => {
    let selected = "";
    if (typeLetter === "Promosi") selected = "PROM";
    else if (typeLetter === "Demosi") selected = "DEM";
    else if (typeLetter === "Mutasi") selected = "MUT";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLetterCode(selected);

    let selectedCompany = "";
    if (company === "MSAL") selectedCompany = "MSAL-HRO";
    else if (company === "MAPA") selectedCompany = "MAPA-HRO";
    else if (company === "PSAM") selectedCompany = "PSAM-HRO";
    else if (company === "PEAK") selectedCompany = "PEAK-HRO";
    else if (company === "KPP") selectedCompany = "KPP-HRO";
    else if (company === "WCJU") selectedCompany = "WCJU-HRO";
    else if (company === "GROUP") selectedCompany = "MSALGROUP-HRO";
    setLetterNumberDept(selectedCompany);

    const fetchData = async () => {
      setLoadingNumber(true);
      const data = await fetchNextLetterNumber(selected, selectedCompany);
      setLetterNumber(data.serialDisplay);
      setLetterNumberMonth(data.monthRoman);
      setLetterNumberYear(data.year);
      setTimeout(() => setLoadingNumber(false), 1000);
    };

    fetchData();
  }, [typeLetter, company]);

  function isValidSerialFormat(value) {
    // value string, contoh "001"
    const re = /^(?!0+$)\d{3,4}$/;
    return re.test(value);
  }
  const [numberStatus, setNumberStatus] = useState("idle");

  useEffect(() => {
    // jika kosong, reset
    if (!letterNumber) {
      setNumberStatus("idle");
      return;
    }

    // 1) cek format lokal dulu
    if (!isValidSerialFormat(letterNumber)) {
      setNumberStatus("invalidFormat");
      return;
    }

    // 2) format sudah valid → lanjut debounce cek ke server
    if (!letterCode || !letterNumberDept || !letterNumberYear) {
      setNumberStatus("idle");
      return;
    }

    setNumberStatus("checking");

    const handler = setTimeout(async () => {
      try {
        setLoadingNumber(true);
        const tempLetterNumber = `${letterNumber}/${letterCode}/${letterNumberDept}/${letterNumberMonth}/${letterNumberYear}`;
        const available = letterList.every(
          (item) => item.letterNumber !== tempLetterNumber,
        );
        const params = new URLSearchParams({
          letterCode,
          letterDept: letterNumberDept,
          year: String(letterNumberYear),
          serialNumber: String(parseInt(letterNumber)),
        });

        const res = await fetch(
          `/api/letters/check-number?${params.toString()}`,
        );
        const json = await res.json();

        if (!res.ok || !json.success) {
          setNumberStatus("error");
          return;
        }
        setNumberStatus(json.available && available ? "available" : "taken");
      } catch (e) {
        console.error("Check number error:", e);
        setNumberStatus("error");
      } finally {
        setLoadingNumber(false);
      }
    }, 500); // debounce 500 ms

    // cleanup: batalkan request kalau user masih mengetik
    return () => clearTimeout(handler);
  }, [letterNumber, letterCode, letterNumberDept, letterNumberYear]);

  const handleAddData = async () => {
    if (letterList.length === 8) {
      setErrorNotif("Batas maksimal sekali generate sebanyak 8 surat.");
      return;
    }
    let logo = "/logos/msal.png";
    let companySelected = "PT. Mulia Sawit Agro Lestari";
    if (company === "MSAL") {
      logo = "/logos/msal.png";
      companySelected = "PT. Mulia Sawit Agro Lestari";
    } else if (company === "PSAM") {
      logo = "/logos/psam.png";
      companySelected = "PT. Persada Sejahtera Agro Makmur";
    } else if (company === "MAPA") {
      logo = "/logos/mapa.png";
      companySelected = "PT. Mitra Agro Persada Abadi";
    } else if (company === "PEAK") {
      logo = "/logos/peak.png";
      companySelected = "PT. Persada Era Agro Kencana";
    } else if (company === "KPP") {
      logo = "/logos/kpp.png";
      companySelected = "PT. Kereng Pangi Perdana";
    } else if (company === "WCJU") {
      logo = "/logos/wcju.png";
      companySelected = "PT. Wana Catur Jaya Utama";
    } else if (company === "GROUP") {
      logo = "/logos/msal.png";
      companySelected = "PT. Mulia Sawit Agro Lestari";
    }

    const isValidLetter = (newLetter) => {
      // Iterasi melalui setiap key dari newLetter
      for (let key of Object.keys(newLetter)) {
        const value = newLetter[key];

        // Cek jika nilai kosong (null, undefined, string kosong, atau array kosong)
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          console.log(`Key '${key}' memiliki nilai kosong.`);
          return false; // Jika ada nilai yang kosong, return false
        }
      }
      return true; // Semua nilai ada isinya
    };

    const newLetter = {
      letterName: `Surat ${typeLetter} ${employeeName}`,
      type: typeLetter,
      companyName: companySelected,
      companyID: company,
      letterNumber: `${letterNumber}/${letterCode}/${letterNumberDept}/${letterNumberMonth}/${letterNumberYear}`,
      letterDateDisplay: formattedDate(letterDate),
      effectiveDateDisplay: formattedDate(effectiveDate),
      letterDate,
      effectiveDate,
      city,
      manager,
      position,
      logo,
      year: letterNumberYear,
      letterCode,
      letterDept: letterNumberDept,
      serial: letterNumber,
      employee: {
        name: employeeName,
        gender,
        lastPosition,
        currentPosition,
        lastDepartment,
        currentDepartment,
        lastCompany,
        currentCompany,
        lastLocation,
        currentLocation,
        lastRank,
        currentRank,
        lastStatus,
        currentStatus,
      },
    };

    if (isValidLetter(newLetter) & (numberStatus === "available")) {
      const nextSerial = await findNextAvailableSerial({
        baseSerialFromList: letterNumber,
        letterCode: letterCode,
        letterDept: letterNumberDept,
        year: letterNumberYear,
      });
      const serialDisplay =
        nextSerial < 1000
          ? String(nextSerial).padStart(3, "0")
          : String(nextSerial);

      setLetterNumber(serialDisplay);

      setLetterList((prevState) => [...prevState, newLetter]);
    } else {
      setErrorNotif("Kamu belum isi semua data.");
    }
  };

  return (
    <>
      {/* Pilih Surat */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Pilih Surat</p>
        <div className="relative mt-1 flex w-full items-center space-x-3">
          <Filter
            filterData={typeLetterData}
            filter={typeLetter}
            setFilter={setTypeLetter}
          />
        </div>
      </div>
      {/* Pilih Perusahaan */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Pilih Perusahaan</p>
        <div className="relative mt-1 flex w-full items-center space-x-3">
          <Filter
            filterData={companyData}
            filter={company}
            setFilter={setCompany}
          />
        </div>
      </div>
      {/* Nomor Surat */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Nomor Surat</p>
        {loadingNumber ? (
          <div className="skeleton relative h-6 w-1/2 rounded-xl bg-white/40"></div>
        ) : (
          <div className="relative flex w-full items-center space-x-1 font-semibold">
            <input
              type="text"
              value={letterNumber}
              onChange={(e) => setLetterNumber(e.target.value)}
              className="relative w-15 rounded-xl bg-white/40 px-2 py-1 text-center focus:outline-blue-400"
            />
            <p>/</p>
            <p>{letterCode}</p>
            <p>/</p>
            <p>{letterNumberDept}</p>
            <p>/</p>
            <p>{letterNumberMonth}</p>
            <p>/</p>
            <p>{letterNumberYear}</p>
            {numberStatus === "available" && (
              <div className="relative ml-3 flex w-fit items-center justify-center space-x-1 rounded-xl bg-green-50 px-3 py-1 text-sm text-green-600">
                <FaRegCircleCheck /> <p>Valid</p>
              </div>
            )}
            {numberStatus === "taken" && (
              <div className="relative ml-3 flex w-fit items-center justify-center space-x-1 rounded-xl bg-red-50 px-3 py-1 text-sm text-red-600">
                <RiCloseCircleLine />
                <p>Nomor sudah ada, silahkan ganti nomor lain</p>
              </div>
            )}
            {numberStatus === "invalidFormat" && (
              <div className="relative ml-3 flex w-fit items-center justify-center space-x-1 rounded-xl bg-red-50 px-3 py-1 text-sm text-red-600">
                <RiCloseCircleLine />
                <p>Format nomor tidak valid</p>
              </div>
            )}
            {numberStatus === "error" && (
              <div className="relative ml-3 flex w-fit items-center justify-center space-x-1 rounded-xl bg-yellow-50 px-3 py-1 text-sm text-yellow-600">
                <CgDanger />
                <p>Gagal memeriksa nomor, coba lagi.</p>
              </div>
            )}
          </div>
        )}
        {/* Tanngal Surat dan Tanggal Berlaku */}
      </div>
      <div className="relative flex w-full items-center space-x-12 border-b border-gray-300 pb-3">
        <div className="relative flex w-fit flex-col">
          <p>Tanggal Surat</p>
          <input
            type="date"
            value={letterDate}
            onChange={(e) => setLetterDate(e.target.value)}
            className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
          />
        </div>
        <div className="relative flex w-fit flex-col">
          <p>Tanggal Berlaku</p>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
          />
        </div>
      </div>
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Ditetapkan DI</p>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
        />
      </div>
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Ditetapkan Oleh</p>
        <div className="relative flex w-full items-center space-x-3">
          <div className="relative flex w-1/2 flex-col">
            <p>Nama</p>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Jabatan</p>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
            />
          </div>
        </div>
      </div>
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Nama Karyawan</p>
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeName(e.target.value)}
          className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
        />
      </div>
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Jenis Kelamin</p>
        <div className="relative flex w-full items-center space-x-3">
          <Filter
            filterData={genderData}
            filter={gender}
            setFilter={setGender}
          />
        </div>
      </div>
      {/* Posisi */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Posisi</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <input
              type="text"
              value={lastPosition}
              onChange={(e) => setLastPosition(e.target.value)}
              className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <input
              type="text"
              value={currentPosition}
              onChange={(e) => setCurrentPosition(e.target.value)}
              className="rounded-xl bg-white/40 px-2 py-1 focus:outline-blue-400"
            />
          </div>
        </div>
      </div>
      {/* Lokasi */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Lokasi</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <Select
              options={[
                { value: "Site PT. MSAL", label: "Site PT. MSAL" },
                { value: "Site PT. MAPA", label: "Site PT. MAPA" },
                { value: "Site PT. PSAM", label: "Site PT. PSAM" },
                { value: "Site PT. PEAK", label: "Site PT. PEAK" },
                { value: "Site PT. KPP", label: "Site PT. KPP" },
                { value: "Site PT. WCJU", label: "Site PT. WCJU" },
              ]}
              value={lastLocation}
              onChange={setLastLocation}
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <Select
              options={[
                { value: "Site PT. MSAL", label: "Site PT. MSAL" },
                { value: "Site PT. MAPA", label: "Site PT. MAPA" },
                { value: "Site PT. PSAM", label: "Site PT. PSAM" },
                { value: "Site PT. PEAK", label: "Site PT. PEAK" },
                { value: "Site PT. KPP", label: "Site PT. KPP" },
                { value: "Site PT. WCJU", label: "Site PT. WCJU" },
              ]}
              value={currentLocation}
              onChange={setCurrentLocation}
            />
          </div>
        </div>
      </div>
      {/* Div */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Div./Sub Div./Dept.</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <Select
              options={[
                { value: "ADMINISTRASI", label: "ADMINISTRASI" },
                { value: "PABRIK", label: "PABRIK" },
                { value: "QC", label: "QC" },
                { value: "STAFF GM", label: "STAFF GM" },
                { value: "TANAMAN", label: "TANAMAN" },
                { value: "TEKNIK", label: "TEKNIK" },
              ]}
              value={lastDepartment}
              onChange={setLastDepartment}
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <Select
              options={[
                { value: "ADMINISTRASI", label: "ADMINISTRASI" },
                { value: "PABRIK", label: "PABRIK" },
                { value: "QC", label: "QC" },
                { value: "STAFF GM", label: "STAFF GM" },
                { value: "TANAMAN", label: "TANAMAN" },
                { value: "TEKNIK", label: "TEKNIK" },
              ]}
              value={currentDepartment}
              onChange={setCurrentDepartment}
            />
          </div>
        </div>
      </div>
      {/* Perusahaan */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Perusaahaan</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <Select
              options={[
                { value: "PT. MSAL", label: "PT. MSAL" },
                { value: "PT. MAPA", label: "PT. MAPA" },
                { value: "PT. PSAM", label: "PT. PSAM" },
                { value: "PT. PEAK", label: "PT. PEAK" },
                { value: "PT. KPP", label: "PT. KPP" },
                { value: "PT. WCJU", label: "PT. WCJU" },
              ]}
              value={lastCompany}
              onChange={setLastCompany}
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <Select
              options={[
                { value: "PT. MSAL", label: "PT. MSAL" },
                { value: "PT. MAPA", label: "PT. MAPA" },
                { value: "PT. PSAM", label: "PT. PSAM" },
                { value: "PT. PEAK", label: "PT. PEAK" },
                { value: "PT. KPP", label: "PT. KPP" },
                { value: "PT. WCJU", label: "PT. WCJU" },
              ]}
              value={currentCompany}
              onChange={setCurrentCompany}
            />
          </div>
        </div>
      </div>
      {/* Pangkat */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Golongan</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <Select
              options={[
                { value: "SKUH", label: "SKUH" },
                { value: "SKUB", label: "SKUB" },
                { value: "PKWT", label: "PKWT" },
              ]}
              value={lastRank}
              onChange={setLastRank}
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <Select
              options={[
                { value: "SKUH", label: "SKUH" },
                { value: "SKUB", label: "SKUB" },
                { value: "PKWT", label: "PKWT" },
              ]}
              value={currentRank}
              onChange={setCurrentRank}
            />
          </div>
        </div>
      </div>
      {/* Status */}
      <div className="relative flex w-full flex-col border-b border-gray-300 pb-3">
        <p>Status Karyawan</p>
        <div className="relative flex w-full space-x-5">
          <div className="relative flex w-1/2 flex-col">
            <p>Sebelumnya</p>
            <Select
              options={[
                { value: "Tetap", label: "Tetap" },
                { value: "Kontrak", label: "Kontrak" },
                { value: "Percobaan", label: "Percobaan" },
              ]}
              value={lastStatus}
              onChange={setLastStatus}
            />
          </div>
          <div className="relative flex w-1/2 flex-col">
            <p>Sekarang</p>
            <Select
              options={[
                { value: "Tetap", label: "Tetap" },
                { value: "Kontrak", label: "Kontrak" },
                { value: "Percobaan", label: "Percobaan" },
              ]}
              value={currentStatus}
              onChange={setCurrentStatus}
            />
          </div>
        </div>
      </div>
      <Button text="Tambah Data" width="w-full" onClick={handleAddData} />
    </>
  );
}
