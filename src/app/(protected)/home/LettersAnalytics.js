"use client";

import PieChartUI from "@/components/PieChartUI";
import { useEffect, useState } from "react";

export default function LettersAnalytics() {
  const [dataByType, setDataByType] = useState([
    { name: "Promosi", value: 0 },
    { name: "Mutasi", value: 0 },
    { name: "Demosi", value: 0 },
  ]);
  const [dataByCompany, setDataByCompany] = useState([
    { name: "MSAL", value: 0 },
    { name: "PSAM", value: 0 },
    { name: "MAPA", value: 0 },
    { name: "PEAK", value: 0 },
    { name: "KPP", value: 0 },
    { name: "WCJU", value: 0 },
    { name: "GROUP", value: 0 },
  ]);

  useEffect(() => {
    const fetchCountByType = async () => {
      const response = await fetch("/api/dashboard/letters/summary-type");
      if (response.ok) {
        const res = await response.json();
        setDataByType(res.data);
      }
    };

    const fetchCountByCompany = async () => {
      const response = await fetch("/api/dashboard/letters/summary-company");
      if (response.ok) {
        const res = await response.json();
        setDataByCompany(res.data);
      }
    };

    fetchCountByType();
    fetchCountByCompany();
  }, []);

  const colorsByType = [
    "rgba(96,165,250,0.9)", // blue-400
    "rgba(167,139,250,0.9)", // purple-400
    "rgba(147,197,253,0.9)", // blue-300
  ];

  const colorsByCompany = [
    "rgba(96,165,250,0.9)", // blue-400
    "rgba(167,139,250,0.9)", // purple-400
    "rgba(147,197,253,0.9)", // blue-300
    "rgba(196,181,253,0.9)", // purple-300
    "rgba(59,130,246,0.9)", // blue-500
    "rgba(139,92,246,0.9)", // purple-500
    "rgba(125,211,252,0.9)", // sky-300 (biru muda)
  ];

  return (
    <div className="relative flex w-full space-x-5 pt-3">
      <div className="relative aspect-4/3 w-1/4 rounded-xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
        <h2 className="text-lg font-semibold text-black">
          Total Letter by Type
        </h2>
        <PieChartUI data={dataByType} colors={colorsByType} />
      </div>
      <div className="relative aspect-4/3 w-1/4 rounded-xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-xl transition hover:shadow-2xl">
        <h2 className="text-lg font-semibold text-black">
          Total Letter by Company
        </h2>
        <PieChartUI data={dataByCompany} colors={colorsByCompany} />
      </div>
    </div>
  );
}
