import { buildSuratPdf } from "@/lib/pdf";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dataStr = searchParams.get("data");
  if (!dataStr) {
    return NextResponse.json({ error: "data kosong" }, { status: 400 });
  }

  // Expect payload sebagai array enriched minimal 1 item
  const [surat] = JSON.parse(decodeURIComponent(dataStr));

  // Ambil logo: boleh data URL/base64 atau URL publik
  let logoBytes;
  if (typeof surat.logo === "string" && surat.logo.startsWith("data:image/")) {
    // data URL -> arrayBuffer
    const res = await fetch(surat.logo);
    logoBytes = new Uint8Array(await res.arrayBuffer());
  } else {
    // fallback: ambil dari /logo.png atau path publik lain
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(new URL(surat.logo || "/logos/msal.png", base));
    logoBytes = new Uint8Array(await res.arrayBuffer());
  }

  const bytes = await buildSuratPdf(surat, logoBytes);
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${surat.nomorSurat || surat.letterName || "surat"}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
