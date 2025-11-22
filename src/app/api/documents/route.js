import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page") || "1";
    const limitParam = searchParams.get("limit") || "10";
    const keywordParam = searchParams.get("keyword") || "";
    const filterParam = searchParams.get("filter") || "";

    let page = parseInt(pageParam, 10);
    let limit = parseInt(limitParam, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const offset = (page - 1) * limit;

    const kw = keywordParam.trim().toLowerCase();
    const fil = filterParam.trim().toLowerCase();

    const hasKeyword = kw.length > 0;
    const hasFilter = fil.length > 0 && fil !== "semua";

    const whereClauses = [];
    const params = [];

    if (hasKeyword) {
      // cari di nomor dokumen (bisa ditambah field lain kalau perlu)
      whereClauses.push("LOWER(doc_number) LIKE ?");
      params.push(`%${kw}%`);
    }

    if (hasFilter) {
      whereClauses.push("LOWER(doc_type) = ?");
      params.push(fil);
    }

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const baseQuery = `
      FROM documents
      ${whereSql}
    `;

    const documentsQuery = `
      SELECT doc_type, disk_path, doc_number, unique_id_doc, submitted, approved,
             company, note, staff_date, manager_date, director_date, purchasing_date,
             finance_date, created_at, updated_at
      ${baseQuery}
      -- PENTING: bagian ini memastikan data terbaru di paling atas
      -- DESC = descending, jadi created_at paling baru muncul dulu
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      ${baseQuery}
    `;

    const documentsParams = [...params, limit, offset];
    const documents = await executeQuery(documentsQuery, documentsParams);

    const countResult = await executeQuery(countQuery, params);
    const total = Array.isArray(countResult) ? countResult[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: documents,
      meta: {
        page,
        limit,
        total,
        totalPages,
        keyword: kw,
        filter: fil,
      },
    });
  } catch (error) {
    console.error("Documents error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat get documents" },
      { status: 500 },
    );
  }
}
