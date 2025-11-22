import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT
        letter_type,
        COUNT(*) AS total
      FROM generated_letters
      WHERE letter_type IN ('Promosi', 'Mutasi', 'Demosi')
      GROUP BY letter_type;
    `;

    const rows = await executeQuery(query);

    // Normalisasi agar selalu ada 3 elemen dengan urutan tetap
    const base = {
      Promosi: 0,
      Mutasi: 0,
      Demosi: 0,
    };

    for (const row of rows) {
      if (base[row.letter_type] !== undefined) {
        base[row.letter_type] = Number(row.total) || 0;
      }
    }

    const result = [
      { name: "Promosi", value: base.Promosi },
      { name: "Mutasi", value: base.Mutasi },
      { name: "Demosi", value: base.Demosi },
    ];

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error("Error calculating generated letters summary:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate generated letters summary",
      },
      { status: 500 },
    );
  }
}
