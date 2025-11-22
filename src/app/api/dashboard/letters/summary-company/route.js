import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT
        company_code,
        COUNT(*) AS total
      FROM generated_letters
      WHERE company_code IN ('MSAL', 'MAPA', 'PEAK', 'PSAM', 'WCJU', 'KPP', 'GROUP')
      GROUP BY company_code;
    `;

    const rows = await executeQuery(query);

    const base = {
      MSAL: 0,
      PSAM: 0,
      MAPA: 0,
      PEAK: 0,
      KPP: 0,
      WCJU: 0,
      GROUP: 0,
    };

    for (const row of rows) {
      if (base[row.company_code] !== undefined) {
        base[row.company_code] = Number(row.total) || 0;
      }
    }

    const result = [
      { name: "MSAL", value: base.MSAL },
      { name: "PSAM", value: base.PSAM },
      { name: "MAPA", value: base.MAPA },
      { name: "PEAK", value: base.PEAK },
      { name: "KPP", value: base.KPP },
      { name: "WCJU", value: base.WCJU },
      { name: "GROUP", value: base.GROUP },
    ];

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error calculating company summary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate company summary",
      },
      { status: 500 },
    );
  }
}
