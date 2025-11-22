// app/api/documents/monthly-summary/route.js
import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function GET() {
  try {
    const query = `
      SELECT
        MONTH(created_at) AS month_num,
        SUM(CASE WHEN doc_type = 'PDDO' THEN 1 ELSE 0 END) AS PDDO,
        SUM(CASE WHEN doc_type = 'SPP'  THEN 1 ELSE 0 END) AS SPP,
        SUM(CASE WHEN doc_type = 'SPPA' THEN 1 ELSE 0 END) AS SPPA
      FROM documents
      WHERE YEAR(created_at) = YEAR(CURDATE())
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at);
    `;

    const rows = await executeQuery(query);

    // Map hasil SQL (yang mungkin hanya beberapa bulan) ke 12 bulan fix
    const dataByMonthNum = new Map();
    for (const row of rows) {
      dataByMonthNum.set(row.month_num, {
        PDDO: row.PDDO ?? 0,
        SPP: row.SPP ?? 0,
        SPPA: row.SPPA ?? 0,
      });
    }

    const dataInput = MONTH_LABELS.map((label, index) => {
      const monthNum = index + 1; // 1–12
      const counts = dataByMonthNum.get(monthNum) || {
        PDDO: 0,
        SPP: 0,
        SPPA: 0,
      };

      return {
        month: label,
        PDDO: counts.PDDO,
        SPP: counts.SPP,
        SPPA: counts.SPPA,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: dataInput,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error calculating monthly document summary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate monthly document summary",
      },
      { status: 500 },
    );
  }
}
