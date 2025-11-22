"use client";
import { useRef, useEffect } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";

export default function DeleteConfirmModal({
  show,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}) {
  const modalRef = useRef(null);

  // ✅ Tutup modal kalau user klik di luar area modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md">
      {/* Modal Card */}
      <div
        ref={modalRef}
        className="animate-scaleUp relative w-[360px] rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_8px_40px_rgba(160,180,255,0.4)] backdrop-blur-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 transition hover:text-slate-800"
        >
          <FiX size={20} />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="text-3xl text-red-500" />
          </div>
        </div>

        {/* Text */}
        <h2 className="mb-2 text-center text-xl font-semibold text-slate-800">
          {title}
        </h2>
        <p className="mb-6 text-center text-sm text-slate-600">{message}</p>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-white/70 px-5 py-2 font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-red-400 to-pink-400 px-6 py-2 font-semibold text-white shadow-md hover:scale-105 active:scale-95"
          >
            Delete
            {/* Shine on hover */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
              <span className="rotate-25deg absolute top-0 -left-1/2 h-full w-2/3 bg-white/40 opacity-0 blur-md transition-all duration-700 group-hover:translate-x-[200%] group-hover:opacity-100" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
