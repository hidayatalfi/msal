// app/api/surat/batch/route.js
import { NextResponse } from "next/server";
import { buildSuratPdf } from "@/lib/pdf";
import JSZip from "jszip";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dataStr = searchParams.get("data");
  if (!dataStr)
    return NextResponse.json({ error: "data kosong" }, { status: 400 });

  const list = JSON.parse(decodeURIComponent(dataStr));
  const logoRes = await fetch(
    new URL(
      "/logos/msal.png",
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    ),
  );
  const logoBytes = new Uint8Array(await logoRes.arrayBuffer());

  const zip = new JSZip();
  for (const item of list) {
    const pdf = await buildSuratPdf(item, logoBytes);
    zip.file(`${item.letterName}.pdf`, pdf);
  }

  const buf = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
  });
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="paket-surat-${Date.now()}.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
