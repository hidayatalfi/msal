// app/api/documents/[id]/route.js
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  //   const id = new URL(request.url).searchParams.get("id");
  const id = request.nextUrl.searchParams.get("id");
  try {
    const rolesQuery = `
      SELECT doc_type, disk_path, doc_number, unique_id_doc, submitted, approved, company, note, staff_date, manager_date, director_date, purchasing_date, finance_date FROM documents WHERE unique_id_doc = ?
      `;
    const documents = await executeQuery(rolesQuery, [id]);
    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 }); // 404 jika tidak ada data [web:5][web:14]
    }
    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Documents error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat get docuements" },
      { status: 500 },
    );
  }
}
