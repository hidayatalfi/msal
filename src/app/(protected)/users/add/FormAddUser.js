"use client";

import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FormAddUser({ setLoading, setError }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roleSelected, setRoleSelected] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch("/api/roles");
      if (response.ok) {
        const res = await response.json();
        setRoles(res.roles);
      }
    };

    fetchRoles();
  }, []);

  const router = useRouter();

  const handleCreateUser = async () => {
    const isValidInput = (newUser) => {
      // Iterasi melalui setiap key dari newLetter
      for (let key of Object.keys(newUser)) {
        const value = newUser[key];

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

    const newUser = {
      name,
      username,
      password,
      role_id: roleSelected,
    };

    if (isValidInput(newUser)) {
      setLoading(true);
      try {
        const response = await fetch("/api/users/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          router.replace("/users");
          setError(false);
        }

        const res = await response.json();
        setError(res.message);
      } catch (error) {
        setError("Error: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Silahkan isi semua data.");
    }
  };

  return (
    <div className="relative flex w-full flex-col space-y-3 text-black">
      <div className="relative flex w-full flex-col">
        <label className="font-semibold">Nama Lengkap</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="relative w-full rounded-xl bg-white/40 px-3 py-2 focus:outline-blue-400"
        />
      </div>
      <div className="relative flex w-full flex-col">
        <label className="font-semibold">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="relative w-full rounded-xl bg-white/40 px-3 py-2 lowercase focus:outline-blue-400"
        />
      </div>
      <div className="relative flex w-full flex-col">
        <label className="font-semibold">Password</label>
        <div className="relative flex w-full items-center space-x-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative w-full rounded-xl bg-white/40 px-3 py-2 lowercase focus:outline-blue-400"
          />
          <p
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer font-bold text-blue-400"
          >
            {showPassword ? "Hide" : "Show"}
          </p>
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <label className="font-semibold">Password</label>
        <div className="relative flex w-full items-center space-x-3">
          {roles.map((item, index) => (
            <div
              key={index}
              onClick={() => setRoleSelected(item.id)}
              className={`${roleSelected === item.id && "bg-linear-to-r from-blue-400 to-purple-400 text-white"} flex w-fit cursor-pointer items-center justify-center rounded-full border border-gray-300 px-5 py-1`}
            >
              <p className="text-sm">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={() => handleCreateUser()} text="Simpan" width="w-full" />
    </div>
  );
}
