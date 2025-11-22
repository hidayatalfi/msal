// app/api/documents/[id]/download/route.js
import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { executeQuery } from "@/lib/db";
import { r2Client } from "@/lib/r2Client";

const BUCKET = process.env.R2_BUCKET;

export async function GET(_req, { params }) {
  try {
    const getParams = await params;
    const id = getParams.id;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    if (!BUCKET) {
      return new NextResponse("R2_BUCKET not configured", { status: 500 });
    }

    // 1) Ambil metadata dokumen dari DB
    const rows = await executeQuery(
      "SELECT  stored_key, original_name FROM documents WHERE unique_id_doc = ? LIMIT 1",
      [id],
    );

    if (!rows || rows.length === 0) {
      return new NextResponse("Document not found", { status: 404 });
    }

    const doc = rows[0];
    const key = doc.stored_key;
    if (!key) {
      return new NextResponse("Document has no stored key", { status: 404 });
    }

    // 2) Ambil objek dari R2
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    });

    const r2Res = await r2Client.send(command);

    // Body dari GetObject adalah ReadableStream (di runtime Edge/Node Next.js 13+)
    const bodyStream = r2Res.Body;

    // 3) Siapkan header untuk response
    const filename =
      (doc.original_name && String(doc.original_name)) || "document.pdf";

    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    // Attachment agar browser menawarkan download, bukan inline (sesuai preferensi Anda)
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );

    // Optional: forward ukuran file jika tersedia
    if (r2Res.ContentLength != null) {
      headers.set("Content-Length", String(r2Res.ContentLength));
    }

    return new NextResponse(bodyStream, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Download document error:", err);

    // Jika error karena objek tidak ditemukan di R2
    if (err?.$metadata?.httpStatusCode === 404) {
      return new NextResponse("File not found in storage", { status: 404 });
    }

    return new NextResponse("Download error", { status: 500 });
  }
}
