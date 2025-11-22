import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT
        FLOOR((DAY(created_at) - 1) / 7) + 1 AS week_number,
        SUM(CASE WHEN doc_type = 'SPP'  THEN 1 ELSE 0 END) AS spp,
        SUM(CASE WHEN doc_type = 'SPPA' THEN 1 ELSE 0 END) AS sppa,
        SUM(CASE WHEN doc_type = 'PDDO' THEN 1 ELSE 0 END) AS pddo
      FROM documents
      WHERE YEAR(created_at) = YEAR(CURDATE())
        AND MONTH(created_at) = MONTH(CURDATE())
      GROUP BY week_number
      ORDER BY week_number;
    `;

    const rows = await executeQuery(query);

    // Karena minggu bisa 1 sampai maksimal 5, pastikan array lengkap dan isi dengan 0 jika tidak ada data
    const result = [];
    for (let week = 1; week <= 5; week++) {
      const row = rows.find((r) => r.week_number === week);
      result.push({
        name: `Minggu ke ${week}`,
        spp: row?.spp ?? 0,
        sppa: row?.sppa ?? 0,
        pddo: row?.pddo ?? 0,
      });
    }

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error calculating weekly document summary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate weekly document summary",
      },
      { status: 500 },
    );
  }
}
