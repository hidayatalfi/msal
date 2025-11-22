// app/api/documents/create/route.js
import { executeQuery } from "@/lib/db";
import { r2Client } from "@/lib/r2Client";
import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.R2_BUCKET;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      docNumber,
      company,
      staffDate,
      managerDate,
      directorDate,
      financeDate,
      purchasingDate,
      submitted,
      approved,
      note,
      unique_id_doc,
      file,
      originalName,
      size,
      mime,
      storedKey,
    } = body || {};

    if (file) {
      // 1) Ambil dokumen dari DB
      const rows = await executeQuery(
        "SELECT  stored_key FROM documents WHERE unique_id_doc = ? LIMIT 1",
        [unique_id_doc],
      );

      if (!rows || rows.length === 0) {
        return new NextResponse("Document not found", { status: 404 });
      }

      const doc = rows[0];
      const key = doc.stored_key;

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

      const results = await executeQuery(
        `UPDATE documents
   SET
     doc_number = ?,
     company = ?,
     staff_date = ?,
     manager_date = ?,
     director_date = ?,
     finance_date = ?,
     purchasing_date = ?,
     submitted = ?,
     approved = ?,
     note = ?,
     original_name = ?,
     size_bytes = ?,
     mime_type = ?,
     stored_key = ?,
     updated_at = NOW()
   WHERE unique_id_doc = ?`,
        [
          docNumber,
          company,
          staffDate || null,
          managerDate || null,
          directorDate || null,
          financeDate || null,
          purchasingDate || null,
          submitted,
          approved,
          note,
          originalName,
          size,
          mime,
          storedKey,
          unique_id_doc,
        ],
      );

      if (results.affectedRows > 0) {
        return NextResponse.json(
          { message: "Data berhasil diupdate" },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: "Data tidak ditemukan atau tidak ada perubahan" },
          { status: 404 },
        );
      }
    } else {
      const results = await executeQuery(
        `UPDATE documents
   SET
     doc_number = ?,
     company = ?,
     staff_date = ?,
     manager_date = ?,
     director_date = ?,
     finance_date = ?,
     purchasing_date = ?,
     submitted = ?,
     approved = ?,
     note = ?,
     updated_at = NOW()
   WHERE unique_id_doc = ?`,
        [
          docNumber,
          company,
          staffDate || null,
          managerDate || null,
          directorDate || null,
          financeDate || null,
          purchasingDate || null,
          submitted,
          approved,
          note,
          unique_id_doc,
        ],
      );

      if (results.affectedRows > 0) {
        return NextResponse.json(
          { message: "Data berhasil diupdate" },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: "Data tidak ditemukan atau tidak ada perubahan" },
          { status: 404 },
        );
      }
    }
  } catch (e) {
    console.error(e);
    return new NextResponse("Insert error", { status: 500 });
  }
}
