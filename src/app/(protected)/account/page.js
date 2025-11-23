/* eslint-disable react-hooks/purity */
export default function Accoun() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#f7f9ff]">
      {/* Aurora */}
      <div className="animate-aurora pointer-events-none absolute inset-0 opacity-[0.7]"></div>

      {/* Soft overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-purple-300/20 via-blue-300/15 to-white/40"></div>

      {/* === 3D Floating Glass Cubes === */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="glass-cube animate-cube absolute h-20 w-20 rounded-xl border border-white/30 bg-white/20 shadow-[0_0_40px_rgba(120,90,255,0.2)] backdrop-blur-xl"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 70}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Sparkle particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="animate-sparkle absolute h-[4px] w-[4px] rounded-full bg-white/90 blur-[1px]"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.25}s`,
          }}
        />
      ))}

      {/* === HERO CONTENT === */}
      <div className="animate-fadein relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-6xl font-extrabold text-transparent drop-shadow-[0_0_30px_rgba(120,90,255,0.3)] md:text-7xl">
          HR DESK
        </h1>

        <p className="mt-4 text-xl font-semibold tracking-wide text-gray-700/80 md:text-2xl">
          by Seribumedia
        </p>
      </div>
    </section>
  );
}
