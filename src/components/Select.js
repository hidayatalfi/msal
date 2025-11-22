import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Select({
  options = [],
  value,
  onChange,
  placeholder = "Pilih opsi",
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false); // <-- auto open direction
  const selectRef = useRef(null);

  // Detect click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto positioning: open up or down
  const handleToggle = () => {
    if (!open) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 180 && spaceAbove > spaceBelow) {
        setOpenUp(true);
      } else {
        setOpenUp(false);
      }
    }
    setOpen(!open);
  };

  return (
    <div className="relative w-full" ref={selectRef}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/30 px-2 py-1 text-black shadow-sm backdrop-blur-md transition hover:bg-white/20"
      >
        <span>{value ? value : placeholder}</span>
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`animate-in fade-in absolute left-0 z-999 w-full overflow-hidden rounded-xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-md duration-150 ${openUp ? "bottom-[110%] origin-bottom" : "top-[110%] origin-top"} `}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="cursor-pointer px-4 py-2 text-black transition hover:bg-slate-100"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
