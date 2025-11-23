"use client";
import { useState } from "react";
import FormAddUser from "./FormAddUser";
import Loading from "@/components/Loading";
import Notification from "@/components/Notification";

export default function AddUserPageClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  return (
    <>
      <div className="relative flex w-full justify-center pt-32">
        <div className="relative h-fit w-full max-w-3xl rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.03)] p-4 shadow-md backdrop-blur-md hover:shadow-lg">
          <FormAddUser setLoading={setLoading} setError={setError} />
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
    </>
  );
}
