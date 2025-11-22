"use client";

import { useEffect } from "react";

export default function Notification({
  message = "Hello World",
  onClose,
  title = "Perhatian!",
  warning = false,
}) {
  useEffect(() => {
    // auto-dismiss 3s (opsional)
    const t = setTimeout(() => onClose?.(), 6000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="pointer-events-auto fixed top-6 left-1/2 z-60 -translate-x-1/2">
      <div
        className={`${warning ? "notif-gradient" : "notif-gradient-green"} animate-popIn relative max-w-md rounded-2xl border border-white/10 px-5 py-3 shadow-[0_10px_30px_rgba(8,15,30,0.12)]`}
      >
        {/* gradient glow layer (below content) */}
        <div
          className="absolute inset-0 -z-10 rounded-2xl opacity-90"
          aria-hidden
        />
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            {/* icon */}
            {warning ? (
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-green-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm-1 13.5-3.5-3.5 1.41-1.41L11 12.67l4.09-4.09 1.41 1.41L11 15.5z" />
              </svg>
            )}
          </div>

          <div className="flex-1">
            <p className="font-semibold text-slate-900/95">{title}</p>
            <p className="mt-0.5 text-sm text-slate-700/80">{message}</p>
          </div>

          <button
            onClick={() => onClose?.()}
            className="ml-3 cursor-pointer rounded-md px-2 py-1 text-sm text-slate-700/80 hover:text-slate-900"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
