export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),rgba(245,250,255,0.3)_40%,rgba(230,245,255,0.2))]">
      {/* ✨ Aurora Moving Background */}
      <div className="animate-aurora absolute inset-0 opacity-80 mix-blend-soft-light"></div>

      {/* 🌈 Center loading logo orb */}
      <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-linear-to-tr from-blue-400/70 via-purple-400/70 to-pink-300/70 shadow-[0_0_80px_rgba(160,180,255,0.4)] backdrop-blur-3xl">
        <div className="animate-rotate-slow absolute inset-0 rounded-full border-4 border-white/60 blur-[2px]"></div>

        {/* Inner shimmer pulse */}
        <div className="animate-pulseGlow absolute h-20 w-20 rounded-full bg-white/60 blur-[20px]"></div>

        <span className="relative text-4xl font-bold text-white drop-shadow-lg select-none">
          ✨
        </span>
      </div>

      {/* 🌬️ Floating text shimmer */}
      <div className="animate-textFade absolute bottom-[25%] text-lg font-semibold text-slate-600">
        Loading your experience...
      </div>
    </div>
  );
}
