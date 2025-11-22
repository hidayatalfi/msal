// app/api/documents/delete/[id]/route.js
import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { executeQuery } from "@/lib/db";
import { r2Client } from "@/lib/r2Client";

const BUCKET = process.env.R2_BUCKET;

export async function DELETE(_req, { params }) {
  try {
    const getParams = await params;
    const id = getParams.id;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    if (!BUCKET) {
      return new NextResponse("R2_BUCKET not configured", { status: 500 });
    }

    // 1) Ambil dokumen dari DB
    const rows = await executeQuery(
      "SELECT  stored_key FROM documents WHERE unique_id_doc = ? LIMIT 1",
      [id],
    );

    if (!rows || rows.length === 0) {
      return new NextResponse("Document not found", { status: 404 });
    }

    const doc = rows[0];
    const key = doc.stored_key;

    // TODO: tambahkan cek otorisasi user di sini jika perlu
    // misalnya: pastikan user yang login boleh menghapus dokumen ini

    // 2) Hapus file di R2 (jika stored_key ada)
    if (key) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: key,
        });
        await r2Client.send(command);
      } catch (err) {
        // log, tapi jangan langsung gagalkan seluruh operasi:
        console.error("R2 delete error for key:", key, err);
        // jika ingin ketat, bisa return 502 di sini
      }
    }

    // 3) Hapus row di DB
    await executeQuery("DELETE FROM documents WHERE unique_id_doc = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete document error:", err);
    return new NextResponse("Delete error", { status: 500 });
  }
}
