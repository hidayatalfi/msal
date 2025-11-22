export default function Button({
  text = "Button",
  className,
  width = "w-fit",
  padding = "px-5 py-2",
  type = "submit",
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${width} ${padding} group relative z-10 cursor-pointer overflow-hidden rounded-xl bg-linear-to-r from-blue-400 to-purple-400 font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)] active:scale-95`}
    >
      <span className="relative z-10">{text}</span>

      {/* shine on hover */}
      <span className="pointer-events-none absolute inset-0 rounded-xl before:absolute before:top-0 before:-left-1/2 before:h-full before:w-2/3 before:rotate-25 before:bg-white/50 before:opacity-0 before:blur-md before:transition-all before:duration-700 group-hover:before:translate-x-[200%] group-hover:before:opacity-100" />
    </button>
  );
}
