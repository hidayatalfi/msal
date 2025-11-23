import ButtonLink from "@/components/ButtonLink";
import { getServerAuth } from "@/lib/auth/server-auth";

export default async function Home() {
  const { authenticated } = await getServerAuth();
  return (
    <div className="animate-aurora relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-orange-100">
      <div className="group animate-popIn relative z-20 flex h-22 w-22 items-center justify-center rounded-[28px] border border-white/60 bg-white/40 p-5 shadow-[0_8px_60px_rgba(140,165,255,0.3)] backdrop-blur-2xl transition-transform duration-500 ease-out hover:scale-[1.01]">
        <div className="relative grid h-full w-full grid-cols-2 items-center justify-center gap-1">
          <div className="relative h-full w-full rounded-full bg-blue-500"></div>
          <div className="relative h-full w-full rounded-full bg-black"></div>
          <div className="relative h-full w-full rounded-full bg-black"></div>
          <div className="relative h-full w-full rounded-full bg-black"></div>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center text-center">
        <h1 className="mt-8 text-6xl text-black">Create, save, and track</h1>
        <h2 className="text-6xl text-gray-400">all in one place</h2>
        <p className="mt-5 text-black">
          Manage your documents, collaborate with your team, and stay organized
          seamlessly.
        </p>
        <ButtonLink
          className={"mt-5"}
          text={authenticated ? "Home" : "Sign in"}
          link={authenticated ? "/home" : "/login"}
        />
      </div>
    </div>
  );
}
