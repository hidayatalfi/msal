import HomepageClient from "./home-client";

export default async function Homepage() {
  return (
    <>
      <span className="animate-aurora fixed top-0 left-0 z-0 h-screen w-full"></span>
      <HomepageClient />
    </>
  );
}
