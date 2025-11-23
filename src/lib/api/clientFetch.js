export async function clientFetch(input, init = {}) {
  let res = await fetch(input, init);

  if (res.status === 401) {
    // coba refresh access token
    const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });

    if (refreshRes.ok) {
      // token baru sudah diset di cookie, ulang request sekali
      res = await fetch(input, init);
    }
  }

  return res;
}
