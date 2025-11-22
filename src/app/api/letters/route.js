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
      whereClauses.push(
        "(LOWER(letter_number) LIKE ? OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(employee, '$.name'))) LIKE ?)",
      );
      const like = `%${kw.toLowerCase()}%`;
      params.push(like, like);
    }

    if (hasFilter) {
      whereClauses.push("LOWER(company_code) = ?");
      params.push(fil);
    }

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const baseQuery = `
      FROM generated_letters
      ${whereSql}
    `;

    const documentsQuery = `
      SELECT letter_name, letter_number, letter_type, company_name, company_code, year,
             letter_code, letter_dept, serial_number, letter_date, effective_date, city,
             signature_name, signature_position, employee, unique_id_generated_letter, created_at, updated_at
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
