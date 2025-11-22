"use client";
import Link from "next/link";
import React from "react";
import Button from "./Button";

export default function Navigation({ onClick = () => {} }) {
  const menu = [
    { name: "Home", link: "/home" },
    { name: "Surat", link: "/letters" },
    { name: "Dokumen", link: "/documents" },
    { name: "Akun", link: "/account" },
  ];
  return (
    <nav className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-6 rounded-2xl border border-white/30 bg-white/20 py-3 pr-8 pl-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="group animate-popIn relative z-20 mr-12 flex h-12 w-12 items-center justify-center rounded-xl border border-white/60 bg-white/40 p-3 shadow-[0_8px_60px_rgba(140,165,255,0.3)] backdrop-blur-2xl transition-transform duration-500 ease-out hover:scale-[1.01]">
          <div className="relative grid h-full w-full grid-cols-2 items-center justify-center gap-1">
            <div className="relative h-full w-full rounded-full bg-blue-500"></div>
            <div className="relative h-full w-full rounded-full bg-black"></div>
            <div className="relative h-full w-full rounded-full bg-black"></div>
            <div className="relative h-full w-full rounded-full bg-black"></div>
          </div>
        </div>

        {menu.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="group relative px-2 text-base font-medium text-gray-700 transition hover:text-gray-900"
          >
            {item.name}

            {/* tiny underline gradient hover */}
            <span className="absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-linear-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />

            {/* hover shine (tiny cute shimmer) */}
            <span className="pointer-events-none absolute inset-0 before:absolute before:top-0 before:-left-1/3 before:h-full before:w-1/2 before:rotate-25 before:bg-white/40 before:opacity-0 before:blur-sm before:transition-all before:duration-700 group-hover:before:translate-x-[200%] group-hover:before:opacity-100" />
          </Link>
        ))}

        {/* CTA */}
        <Button onClick={onClick} text="Logout" />
      </div>
    </nav>
  );
}
