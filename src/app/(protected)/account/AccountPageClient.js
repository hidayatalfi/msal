"use client";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import { useState } from "react";
/* eslint-disable react-hooks/purity */
import { FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AccountPageClient({ user }) {
  const [modeChangePassword, setModeChangePassword] = useState(false);
  const [modeChangeUsername, setModeChangeUsername] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateUsername = async () => {
    const isValidInput = (newUser) => {
      for (let key of Object.keys(newUser)) {
        const value = newUser[key];
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          console.log(`Key '${key}' memiliki nilai kosong.`);
          return false;
        }
      }
      return true;
    };
    const newUsername = { new_username: username };
    if (isValidInput(newUsername)) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/account/${user.uniqueIdUser}/username`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUsername),
          },
        );

        if (response.ok) {
          setSuccess("Berhasil update username");
          setModeChangeUsername(false);
        } else {
          const res = await response.json();
          setError(res.message);
        }
      } catch (error) {
        console.log("Error update username", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Username masih kosong");
    }
  };

  const handleUpdatePassword = async () => {
    const isValidInput = (newUser) => {
      for (let key of Object.keys(newUser)) {
        const value = newUser[key];
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
    const newDataPassword = {
      new_password: newPassword,
      old_password: oldPassword,
    };
    if (isValidInput(newDataPassword)) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/account/${user.uniqueIdUser}/password`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDataPassword),
          },
        );

        if (response.ok) {
          setSuccess("Berhasil update kata sandi");
          setModeChangePassword(false);
          setOldPassword("");
          setNewPassword("");
        } else {
          const res = await response.json();
          setError(res.message);
        }
      } catch (error) {
        console.log("Error update kata sandi", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Ada data yang masih kosong");
    }
  };
  return (
    <section className="relative flex h-screen w-full items-center justify-center">
      {/* Aurora */}
      <div className="animate-aurora pointer-events-none absolute inset-0 opacity-[0.7]"></div>
      {/* === HERO CONTENT === */}
      <div className="animate-fadein relative flex w-full max-w-4xl flex-col space-y-3">
        <div className="relative flex w-full items-center justify-center">
          <div className="relative flex aspect-square w-32 max-w-3xl items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <FaUserTie className="text-6xl text-blue-400" />
          </div>
          <div className="relative flex w-full flex-col items-center justify-center">
            <h1 className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-[0_0_30px_rgba(120,90,255,0.3)]">
              HR DESK
            </h1>

            <p className="text-lg font-semibold tracking-wide text-gray-700/80">
              by Seribumedia
            </p>
          </div>
        </div>
        <div className="relative flex w-full flex-col space-y-5 rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="relative flex w-full flex-col space-y-3">
            <h2 className="font-bold">Profile</h2>
            <div className="relative flex w-full space-x-3 border-b border-slate-300 pb-3">
              <div className="relative w-full">
                <p>Nama</p>
              </div>
              <p>:</p>
              <div className="relative w-full">
                <p>{user.fullName}</p>
              </div>
            </div>
            <div className="relative flex w-full space-x-3 border-b border-slate-300 pb-3">
              <div className="relative w-full">
                <p>Username</p>
              </div>
              <p>:</p>
              <div className="relative flex w-full items-center justify-between space-x-3">
                {modeChangeUsername ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white/20 px-2 py-1 lowercase focus:outline-blue-400"
                  />
                ) : (
                  <p>{username}</p>
                )}

                <button
                  onClick={() => setModeChangeUsername(!modeChangeUsername)}
                  className="cursor-pointer font-medium text-blue-400 underline"
                >
                  {modeChangeUsername ? "Batal" : "Ganti"}
                </button>
              </div>
            </div>
            {modeChangeUsername && (
              <>
                <div className="relative flex w-full space-x-3 pb-3">
                  <div className="relative w-full"></div>
                  <p></p>
                  <div className="relative w-full">
                    <Button
                      onClick={handleUpdateUsername}
                      padding="px-5 py-1"
                      text="Update"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative flex w-full flex-col space-y-3">
            <h2 className="font-bold">Keamanan</h2>
            <div className="relative flex w-full space-x-3 pb-3">
              <div className="relative w-full">
                <p>Kata Sandi</p>
              </div>
              <p></p>
              <div className="relative w-full">
                <button
                  onClick={() => {
                    setModeChangePassword(!modeChangePassword);
                    if (modeChangePassword) {
                      setNewPassword("");
                      setOldPassword("");
                    }
                  }}
                  className="cursor-pointer font-medium text-blue-400 underline"
                >
                  {modeChangePassword ? "Batal" : "Ganti Kata Sandi"}
                </button>
              </div>
            </div>
            {modeChangePassword && (
              <>
                <div className="relative flex w-full items-center space-x-3 pb-3">
                  <div className="relative w-full">
                    <p>Kata Sandi Lama</p>
                  </div>
                  <p>:</p>
                  <div className="relative w-full">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama"
                      className="w-full rounded-xl border border-slate-300 bg-white/20 px-2 py-1 focus:outline-blue-400"
                    />
                    <span
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="relative flex w-full items-center space-x-3 pb-3">
                  <div className="relative w-full">
                    <p>Kata Sandi Baru</p>
                  </div>
                  <p>:</p>
                  <div className="relative w-full">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan kata sandi baru"
                      className="w-full rounded-xl border border-slate-300 bg-white/20 px-2 py-1 focus:outline-blue-400"
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="relative flex w-full items-center space-x-3 pb-3">
                  <div className="relative w-full"></div>
                  <p></p>
                  <div className="relative w-full">
                    <Button
                      onClick={handleUpdatePassword}
                      text="Update"
                      padding="px-5 py-1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {error && (
        <Notification
          title="Priiiiit!"
          message={error}
          onClose={() => setError("")}
          warning
        />
      )}
      {success && (
        <Notification
          title="Salutt, Rispek!"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}
    </section>
  );
}
