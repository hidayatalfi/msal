"use client";
import CardDocument from "@/components/CardDocument";
import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import Notification from "@/components/Notification";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function DocumentsClientPage({ user }) {
  const filterOptions = ["Semua", "PDDO", "SPP", "SPPA"];
  const [filter, setFilter] = useState("Semua");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [loadFiltered, setLoadFiltered] = useState(false);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const searchTimeoutRef = useRef(null);

  const fetchDocuments = async (page = 1, opts = {}) => {
    const {
      keyword: kw = keyword,
      filter: fil = filter,
      limit = meta.limit || 10,
    } = opts;

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (kw && kw.trim().length > 0) {
      params.set("keyword", kw.trim());
    }

    if (fil && fil.trim().length > 0 && fil.toLowerCase() !== "semua") {
      params.set("filter", fil.trim());
    }

    try {
      const res = await fetch(`/api/documents?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setDocuments(json.data);
        setMeta(json.meta);
      } else {
        console.error("Gagal mengambil dokumen:", json.error);
      }
    } catch (err) {
      console.error("Error fetch documents:", err);
    } finally {
      setLoadFiltered(false);
    }
  };

  useEffect(() => {
    fetchDocuments(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoadFiltered(true);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchDocuments(1, { keyword, filter });
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, filter]);

  const handleChangePage = (newPage) => {
    fetchDocuments(newPage);
  };

  const [modalDelete, setModalDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [idDelete, setIdDelete] = useState("");
  const handleDelete = async () => {
    setModalDelete(false);
    setLoading(true);
    try {
      const result = await fetch(`/api/documents/delete/${idDelete}`, {
        method: "DELETE",
      });
      if (result.ok) {
        setDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.unique_id_doc !== idDelete),
        );
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
      <div className="relative flex w-full flex-col items-center pt-32 pb-5">
        <input
          type="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari nomor dokumen"
          className="relative flex h-12 w-full max-w-3xl flex-col rounded-3xl border-2 border-white/40 bg-white/10 px-5 py-2 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl placeholder:text-gray-400 focus:bg-white/50 focus:shadow-blue-100 focus:outline-blue-300"
        />
        <div className="relative mt-5 flex w-full max-w-3xl flex-col space-y-3 rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="relative flex w-full items-center justify-between">
            <div className="relative flex w-32 flex-col">
              <p className="text-xs text-gray-400">Total Documents</p>
              <p className="text-lg">{documents.length}</p>
            </div>
            <div className="relative flex w-fit items-center justify-center space-x-3">
              <Filter
                filterData={filterOptions}
                filter={filter}
                setFilter={setFilter}
              />
            </div>
            <Link
              href={"/documents/add"}
              className="group relative z-10 overflow-hidden rounded-full border border-blue-300 px-5 py-2 font-semibold text-blue-400 shadow-md shadow-blue-200 transition-all active:scale-95"
            >
              <p className="relative z-10">Input Document</p>

              {/* shine on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-xl before:absolute before:top-0 before:-left-1/2 before:h-full before:w-2/3 before:rotate-25 before:bg-white/50 before:opacity-0 before:blur-md before:transition-all before:duration-700 group-hover:before:translate-x-[200%] group-hover:before:opacity-100" />
            </Link>
          </div>
        </div>
        {loadFiltered ? (
          <div className="relative mt-5 flex h-fit w-full max-w-3xl flex-col space-y-3 pb-5">
            <div className="relative flex h-40 w-full items-center justify-center space-x-3 rounded-xl border border-white/10 bg-white/20 p-5 shadow-md backdrop-blur-xl">
              <div className="skeleton aspect-square w-[10%] rounded-full"></div>
              <div className="relative flex w-full flex-col justify-center space-y-2">
                <div className="skeleton h-4 w-1/2 rounded-full"></div>
                <div className="skeleton h-4 w-3/4 rounded-full"></div>
              </div>
              <div className="relative flex w-60 flex-col items-center justify-center space-y-2">
                <div className="skeleton h-3 w-2/5 rounded-full"></div>
                <div className="skeleton h-4 w-2/3 rounded-full"></div>
              </div>
            </div>
            <div className="relative flex h-40 w-full items-center justify-center space-x-3 rounded-xl border border-white/10 bg-white/20 p-5 shadow-md backdrop-blur-xl">
              <div className="skeleton aspect-square w-[10%] rounded-full"></div>
              <div className="relative flex w-full flex-col justify-center space-y-2">
                <div className="skeleton h-4 w-1/2 rounded-full"></div>
                <div className="skeleton h-4 w-3/4 rounded-full"></div>
              </div>
              <div className="relative flex w-60 flex-col items-center justify-center space-y-2">
                <div className="skeleton h-3 w-2/5 rounded-full"></div>
                <div className="skeleton h-4 w-2/3 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : documents.length <= 0 ? (
          <div className="relative mt-5 flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center space-y-3 rounded-xl bg-white/10 px-5 py-3 text-black shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <p>Tidak ada data ditemukan.</p>
          </div>
        ) : (
          <div className="relative mt-5 flex w-full max-w-3xl flex-col space-y-3">
            {documents.map((item, index) => (
              <CardDocument
                key={index}
                doc={item}
                setLoading={setLoading}
                onDelete={() => setModalDelete(true)}
                setIdDelete={setIdDelete}
              />
            ))}
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChangePage={handleChangePage}
              siblingCount={1}
            />
          </div>
        )}
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
          title="Saluttt!"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}
      {modalDelete && (
        <Modal
          show={modalDelete}
          onClose={() => setModalDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
