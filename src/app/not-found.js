import Image from "next/image";
import Link from "next/link";
import kecele from "../../public/kecele.png";
import kecele_hands from "../../public/kecele-hands.png";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-orange-100">
      {/* Ambient light effects */}
      <div className="absolute top-10 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-64 w-64 animate-pulse rounded-full bg-green-300/40 blur-3xl" />
      Main card
      <div className="absolute top-1/2 z-10 flex -translate-y-full flex-col items-center justify-center">
        {/* ambient glow behind emoji */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-yellow-300/30 blur-3xl" />

        {/* Emoji SVG (yellow classic) with teal fedora and hands */}
        <div className="group animate-floatly relative h-60 w-60 after:absolute after:top-0 after:z-50 after:h-full after:w-full">
          <div className="relative h-full w-full transform-gpu transition-transform duration-300 will-change-transform group-hover:scale-105 group-hover:rotate-2">
            <Image
              src={kecele}
              draggable={false}
              alt="emoji"
              className="relative z-10 h-full w-full"
            />
          </div>
          <Image
            src={kecele_hands}
            draggable={false}
            alt="emoji-hands"
            className="group-hover:rotate-2deg pointer-events-none absolute top-0 left-0 z-20 h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Glassmorphism login card */}
        <div className="absolute top-40 z-0 flex w-80 flex-col space-y-5 rounded-3xl border border-white/40 bg-white/10 px-8 py-8 text-center shadow-xl shadow-gray-300/80 backdrop-blur-xs">
          <div className="relative flex flex-col space-y-0">
            <h1 className="text-6xl font-bold tracking-widest text-white">
              404
            </h1>
            <p className="text-base font-bold text-yellow-500">
              Kecele Lagi Nih :(
            </p>
          </div>
          <Link
            href={"/"}
            className="relative w-full cursor-pointer rounded-xl bg-linear-to-r from-blue-400 to-purple-400 px-12 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
