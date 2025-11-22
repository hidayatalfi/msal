/* eslint-disable react-hooks/purity */
export default function Accoun() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#f4f7ff]">
      {/* === Aurora Background (Same style as previous UI) === */}
      <div className="animate-aurora absolute inset-0 opacity-[0.65]"></div>

      {/* Soft glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-300/20 via-blue-300/10 to-transparent" />

      {/* Light particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="animate-float absolute h-2 w-2 rounded-full bg-white/70 blur-[2px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-6xl font-extrabold text-transparent drop-shadow-[0_0_20px_rgba(120,90,255,0.25)] md:text-7xl">
          HR DESK
        </h1>

        <p className="mt-4 text-xl font-medium text-gray-700/80 md:text-2xl">
          by Seribumedia.
        </p>
      </div>
    </section>
  );
}
