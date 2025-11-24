"use client";

import ButtonLink from "@/components/ButtonLink";
import CardUser from "@/components/CardUser";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";
import UserListPage from "./UserListPage";

export default function UserPageClient() {
  const [users, setUsers] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [menuActive, setMenuActive] = useState("Daftar User");
  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch("/api/users");
      if (response.ok) {
        const res = await response.json();
        setUsers(res.users);
      }
    };

    getUsers();
  }, []);

  const [loading, setLoading] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const handleDelete = async () => {
    setShowModalDelete(false);
    setLoading(true);
    try {
      const result = await fetch(`/api/users/delete/${idDelete}`, {
        method: "DELETE",
      });
      if (result.ok) {
        setUsers((prev) => prev.filter((usr) => usr.uniqueIdUser !== idDelete));
        setSuccess("Berhasil menghapus file");
      } else {
        setError("Gagal hapus file");
      }
    } catch (error) {
      setError("Terjadi kendala");
      console.log("Error delete file: ", error);
    } finally {
      setIdDelete("");
      setLoading(false);
    }
  };

  const menu = [
    { name: "Daftar User" },
    { name: "Role" },
    { name: "Role Permission" },
    { name: "User Permission" },
    { name: "Users" },
  ];

  return (
    <div className="reltaive flex w-full px-20 pt-32 pb-5">
      <div className="fixed z-50 flex w-1/4 flex-col gap-6 rounded-2xl border border-white/30 bg-white/20 py-3 pr-8 pl-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {menu.map((item, index) => (
          <div
            key={index}
            onClick={() => setMenuActive(item.name)}
            className="group relative cursor-pointer px-2 text-base font-medium text-nowrap text-gray-700 transition hover:text-gray-900"
          >
            {item.name}

            {menuActive === item.name ? (
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-linear-to-r from-blue-400 to-purple-400 transition-all duration-300" />
            ) : (
              <span className="absolute -bottom-1 left-0 h-1 w-0 rounded-full bg-linear-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full" />
            )}

            {/* hover shine (tiny cute shimmer) */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden before:absolute before:top-0 before:-left-1/3 before:h-full before:w-1/2 before:rotate-25 before:bg-white/40 before:opacity-0 before:blur-sm before:transition-all before:duration-700 group-hover:before:translate-x-[200%] group-hover:before:opacity-100" />
          </div>
        ))}
      </div>
      <div className="relative left-1/4 flex w-full -translate-x-[10%] justify-center">
        {menuActive === "Daftar User" && (
          <UserListPage
            users={users}
            setIdDelete={setIdDelete}
            setShowModalDelete={setShowModalDelete}
          />
        )}
      </div>
      {showModalDelete && (
        <Modal
          show={showModalDelete}
          onClose={() => setShowModalDelete(false)}
          onConfirm={handleDelete}
        />
      )}
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
          title="Saluttt!"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}
    </div>
  );
}
