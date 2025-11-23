"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import emoji from "../../../public/emoji.png";
import emoji_hands from "../../../public/emoji-hands.png";
import Link from "next/link";
import Button from "@/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPageClient() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [pos, setPos] = useState({ x: 0, y: 6 });
  const [errorLogin, setErrorLogin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/home";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLogin("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: code }),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorLogin(json.error || "Login gagal");
        setLoading(false);
        return;
      }
      router.replace(redirectParam);
    } catch (err) {
      setErrorLogin("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const move = (e) =>
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2 * 10, // arah horizontal
        y: (e.clientY / window.innerHeight - 0.5) * 2 * 14, // arah vertikal
      });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-orange-100">
      {/* Ambient light effects */}
      <div className="absolute top-10 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-300/40 blur-3xl" />
      <div className="absolute right-10 bottom-10 h-64 w-64 animate-pulse rounded-full bg-green-300/40 blur-3xl" />

      {/* Main card */}
      <div className="absolute top-2/5 z-10 flex -translate-y-full flex-col items-center justify-center">
        {/* ambient glow behind emoji */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[180px] w-[180px] -translate-x-1/2 rounded-full bg-yellow-300/30 blur-3xl" />

        {/* Emoji SVG (yellow classic) with teal fedora and hands */}
        <div className="group animate-floatly relative h-60 w-60 after:absolute after:top-0 after:z-50 after:h-full after:w-full">
          <div className="relative h-full w-full transform-gpu transition-transform duration-300 will-change-transform group-hover:scale-105 group-hover:rotate-2">
            <Image
              src={emoji}
              draggable={false}
              alt="emoji"
              className="relative z-10 h-full w-full"
              priority
            />
            {/* Mata kiri */}
            <div className="absolute top-[45.5%] left-[31%] z-10 h-9 w-9 overflow-hidden rounded-full">
              <div className="absolute z-20">
                <div className="relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-transparent">
                  <div
                    className="absolute h-[18px] w-[18px] rounded-full bg-linear-to-b from-[#4b2d15] to-[#1c0b00] shadow-inner"
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                      transition:
                        "transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <div className="absolute top-[3px] left-[5px] h-1.5 w-1.5 rounded-full bg-white opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mata kanan */}
            <div className="absolute top-[45.5%] right-[31.5%] z-10 h-9 w-9 overflow-hidden rounded-full">
              <div className="absolute">
                <div className="relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-full bg-transparent">
                  <div
                    className="absolute h-[18px] w-[18px] rounded-full bg-linear-to-b from-[#4b2d15] to-[#1c0b00] shadow-inner"
                    style={{
                      transform: `translate(${pos.x - 4}px, ${pos.y}px)`,
                      transition:
                        "transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <div className="absolute top-[3px] left-[5px] h-1.5 w-1.5 rounded-full bg-white opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Image
            src={emoji_hands}
            draggable={false}
            alt="emoji-hands"
            className="pointer-events-none absolute top-0 left-0 z-20 h-full w-full transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
            priority
          />
        </div>

        {/* Glassmorphism login card */}
        <form
          onSubmit={handleSubmit}
          className="absolute top-42 z-0 flex w-80 flex-col items-center justify-center space-y-3 rounded-3xl border border-white/40 bg-white/10 px-8 pt-16 pb-8 text-center shadow-xl shadow-gray-300/80 backdrop-blur-xs"
        >
          <div className="relative flex w-full flex-col items-start">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white/30 px-3 py-2 text-center text-base text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:cursor-no-drop disabled:bg-gray-300/20"
            />
          </div>
          <div className="relative flex w-full flex-col items-start">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Masukkan Password"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white/30 py-2 pr-8 pl-3 text-center text-base text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:cursor-no-drop disabled:bg-gray-300/20"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400"
              >
                {!showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <p className="mb-1 text-center text-sm text-red-500">{errorLogin}</p>
          {loading ? (
            <div className="bg-gradient-flow mt-3 flex w-full cursor-wait items-center justify-center rounded-xl py-3">
              <div className="text-lg font-semibold text-white">Loading...</div>
            </div>
          ) : (
            <Button width="w-full" text="Login" />
          )}
          <Link href={"/"} className="text-blue-400 hover:text-blue-600">
            Back Homepage
          </Link>
          <p className="mt-5 text-lg font-bold text-yellow-500">
            Rispek Abangkuh!
          </p>
        </form>
      </div>
    </div>
  );
}
