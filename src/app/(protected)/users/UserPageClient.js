"use client";

import ButtonLink from "@/components/ButtonLink";
import CardUser from "@/components/CardUser";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";

export default function UserPageClient() {
  const [users, setUsers] = useState([]);
  const [showModalDelete, setShowModalDelete] = useState(false);
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

  return (
    <>
      <div className="relative flex w-full justify-center pt-32">
        <div className="relative flex w-full max-w-3xl flex-col space-y-3">
          <div className="relative flex w-full items-center justify-between">
            <h1 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
              Daftar Users
            </h1>
            <ButtonLink link="/users/add" text="Tambah User" />
          </div>
          {users.map((item, index) => (
            <CardUser
              key={index}
              user={item}
              onDelete={() => setShowModalDelete(true)}
              setIdDelete={setIdDelete}
            />
          ))}
        </div>
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
    </>
  );
}
