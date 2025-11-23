import Link from "next/link";

export default function ButtonLink({
  text = "Button Link",
  className,
  width = "w-fit",
  padding = "px-8 py-2",
  link = "/",
}) {
  return (
    <Link
      href={link}
      className={`${className} ${width} ${padding} group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-linear-to-r from-blue-400 to-purple-400 text-lg font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform active:scale-95`}
    >
      <span className="relative z-10">{text}</span>

      {/* shine on hover */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl before:absolute before:top-0 before:-left-1/2 before:h-full before:w-2/3 before:rotate-25 before:bg-white/50 before:opacity-0 before:blur-md before:transition-all before:duration-700 group-hover:before:translate-x-[200%] group-hover:before:opacity-100"></span>
    </Link>
  );
}
