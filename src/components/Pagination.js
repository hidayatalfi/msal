"use client";

export default function Pagination({
  page,
  totalPages,
  onChangePage,
  siblingCount = 1,
}) {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages) return;
    onChangePage(targetPage);
  };

  const handleFirst = () => goToPage(1);
  const handleLast = () => goToPage(totalPages);
  const handlePrev = () => goToPage(page - 1);
  const handleNext = () => goToPage(page + 1);

  const getPageNumbers = () => {
    const pages = [];

    const startPage = Math.max(2, page - siblingCount);
    const endPage = Math.min(totalPages - 1, page + siblingCount);

    // selalu tampilkan halaman 1
    pages.push(1);

    // ellipsis setelah 1
    if (startPage > 2) {
      pages.push("left-ellipsis");
    }

    // range tengah di sekitar current page
    for (let p = startPage; p <= endPage; p += 1) {
      pages.push(p);
    }

    // ellipsis sebelum last
    if (endPage < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    // selalu tampilkan halaman terakhir
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-6 flex items-center gap-2">
      {/* First */}
      <button
        onClick={handleFirst}
        disabled={page === 1}
        className={`rounded-xl px-3 py-1 text-sm font-semibold transition ${
          page === 1
            ? "cursor-not-allowed bg-white/30 text-slate-400"
            : "cursor-pointer bg-linear-to-r from-blue-400 to-purple-400 text-white shadow-md hover:scale-105 active:scale-95"
        } `}
      >
        First
      </button>

      {/* Prev */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`rounded-xl px-3 py-1 text-sm font-semibold transition ${
          page === 1
            ? "cursor-not-allowed bg-white/30 text-slate-400"
            : "cursor-pointer bg-linear-to-r from-blue-400 to-purple-400 text-white shadow-md hover:scale-105 active:scale-95"
        } `}
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((item) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={item} className="px-2 text-slate-400">
              …
            </span>
          );
        }

        const pageNumber = item;
        const isActive = pageNumber === page;

        return (
          <button
            key={pageNumber}
            onClick={() => goToPage(pageNumber)}
            disabled={isActive}
            className={`relative rounded-xl px-3 py-1 text-sm font-semibold transition ${
              isActive
                ? `cursor-default border border-white/70 bg-white/60 text-black shadow-[0_8px_30px_rgba(150,170,255,0.45)]`
                : `cursor-pointer border border-white/40 bg-white/30 text-gray-500 backdrop-blur-md hover:scale-110 hover:bg-white/50 active:scale-95`
            } `}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`rounded-xl px-3 py-1 text-sm font-semibold transition ${
          page === totalPages
            ? "cursor-not-allowed bg-white/30 text-slate-400"
            : "cursor-pointer bg-linear-to-r from-blue-400 to-purple-400 text-white shadow-md hover:scale-105 active:scale-95"
        } `}
      >
        Next
      </button>

      {/* Last */}
      <button
        onClick={handleLast}
        disabled={page === totalPages}
        className={`rounded-xl px-3 py-1 text-sm font-semibold transition ${
          page === totalPages
            ? "cursor-not-allowed bg-white/30 text-slate-400"
            : "cursor-pointer bg-linear-to-r from-blue-400 to-purple-400 text-white shadow-md hover:scale-105 active:scale-95"
        } `}
      >
        Last
      </button>
    </div>
  );
}
