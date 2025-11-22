"use client";
import BarChartUI from "@/components/BarChartUI";
import LineChartUI from "@/components/LineChartUI";
import { useEffect, useState } from "react";
import { LuFileClock } from "react-icons/lu";

export default function DocumentsAnalytics() {
  const [diffTimeDocs, setDiffTimeDocs] = useState({
    spp_manager: 0,
    spp_director: 0,
    pddo_manager: 0,
    pddo_director: 0,
    all_docs: 0,
  });
  const [dataWeekly, setDataWeekly] = useState([
    { name: "Minggu ke 1", spp: 0, sppa: 0, pddo: 0 },
    { name: "Minggu ke 2", spp: 0, sppa: 0, pddo: 0 },
    { name: "Minggu ke 3", spp: 0, sppa: 0, pddo: 0 },
    { name: "Minggu ke 4", spp: 0, sppa: 0, pddo: 0 },
  ]);
  const [dataInput, setDataInput] = useState([]);
  useEffect(() => {
    const fetchDiffTimeDocs = async () => {
      const response = await fetch("/api/dashboard/docs/diff");
      if (response.ok) {
        const res = await response.json();
        setDiffTimeDocs(res.data);
      }
    };

    const fetchCountDocs = async () => {
      const response = await fetch("/api/dashboard/docs/count");
      if (response.ok) {
        const res = await response.json();
        setDataInput(res.data);
      }
    };

    const fetchWeeklyDocs = async () => {
      const response = await fetch("/api/dashboard/docs/weekly-summary");
      if (response.ok) {
        const res = await response.json();
        setDataWeekly(res.data);
      }
    };

    fetchCountDocs();
    fetchDiffTimeDocs();
    fetchWeeklyDocs();
  }, []);

  const today = new Date();
  const year = today.getFullYear();

  // Array nama bulan (0 = Januari, 11 = Desember)
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Ambil index bulan dari objek Date (0-11)
  const month = bulan[today.getMonth()];

  return (
    <div className="relative flex w-full flex-col space-y-5 pt-3">
      <div className="relative flex w-full space-x-5">
        <div className="relative w-1/2 p-12">
          <h1 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-6xl font-bold text-transparent">
            Documents Analytics
          </h1>
        </div>
        <div className="relative flex w-3/4 space-x-5">
          <div className="flex w-fit flex-col items-center justify-center rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.03)] p-4 shadow-md backdrop-blur-md hover:shadow-lg">
            <div className="relative flex h-full w-full flex-col text-black">
              <h1 className="font-bold">Rata-Rata Waktu Proses SPP & SPPA</h1>
              <div className="relative flex h-full w-full items-center justify-between space-x-3">
                <div className="relative flex h-full w-fit flex-col justify-center">
                  <p>Dept. Head</p>
                  <div className="relative flex rounded-xl bg-linear-to-br from-blue-500 to-blue-400 py-1 pr-12 pl-3 text-white">
                    <p className="text-5xl font-bold">
                      {diffTimeDocs.spp_manager}
                    </p>
                    <p className="font-medium">Hari</p>
                  </div>
                </div>
                <div className="relative flex h-full w-fit flex-col justify-center">
                  <p>Director</p>
                  <div className="relative flex rounded-xl bg-linear-to-br from-blue-400 to-blue-300 py-1 pr-12 pl-3 text-white">
                    <p className="text-5xl font-bold">
                      {diffTimeDocs.spp_director}
                    </p>
                    <p className="font-medium">Hari</p>
                  </div>
                </div>
              </div>
            </div>
            <span className="relative h-[0.2] w-full bg-slate-400"></span>
            <div className="relative flex h-full w-full flex-col pt-3 text-black">
              <h1 className="font-bold">Rata-Rata Waktu Proses PDDO</h1>
              <div className="relative flex h-full w-full items-center justify-between space-x-3">
                <div className="relative flex h-full w-fit flex-col justify-center">
                  <p>Dept. Head</p>
                  <div className="relative flex rounded-xl bg-linear-to-br from-purple-500 to-purple-400 py-1 pr-12 pl-3 text-white">
                    <p className="text-5xl font-bold">
                      {diffTimeDocs.pddo_manager}
                    </p>
                    <p className="font-medium">Hari</p>
                  </div>
                </div>
                <div className="relative flex h-full w-fit flex-col justify-center">
                  <p>Director</p>
                  <div className="relative flex rounded-xl bg-linear-to-br from-purple-400 to-purple-300 py-1 pr-12 pl-3 text-white">
                    <p className="text-5xl font-bold">
                      {diffTimeDocs.pddo_director}
                    </p>
                    <p className="font-medium">Hari</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-3/2 w-full rounded-2xl border border-white/80 bg-linear-to-br from-blue-400 to-blue-500 p-4 shadow-md backdrop-blur-md hover:shadow-lg">
            <h1 className="text-2xl font-semibold">Document Approval Cycle</h1>
            <p>Rata-rata waktu proses dokumen</p>
            <div className="relative -mt-3 flex h-4/5 w-full items-center pl-8">
              <p className="text-9xl font-bold">{diffTimeDocs.all_docs}</p>
              <p className="text-3xl">Hari</p>
            </div>
            <LuFileClock className="absolute right-3 bottom-3 text-8xl text-yellow-300" />
          </div>
        </div>
      </div>
      <div className="relative flex w-full items-center space-x-5">
        <div className="relative w-1/2">
          <LineChartUI
            data={dataInput}
            title={`Total Input Dokumen ${year}`}
            lines={[
              { key: "SPP", color: "rgba(96,165,250,1)" }, // blue-400
              { key: "PDDO", color: "rgba(167,139,250,1)" }, // purple-400
              { key: "SPPA", color: "rgba(147,197,253,1)" }, // blue-300
            ]}
          />
        </div>
        <div className="relative w-1/2">
          <BarChartUI
            data={dataWeekly}
            bars={[
              { dataKey: "pddo", color: "#8B5CF6" },
              { dataKey: "spp", color: "#8ec5ff" },
              { dataKey: "sppa", color: "#51a2ff" },
            ]}
            title={`Total Dokumen Bulan ${month}`}
          />
        </div>
      </div>
    </div>
  );
}
