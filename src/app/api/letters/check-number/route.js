// app/api/letters/check-number/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const letterCode = searchParams.get("letterCode");
    const letterDept = searchParams.get("letterDept");
    const yearParam = searchParams.get("year");
    const serialParam = searchParams.get("serialNumber");

    if (!letterCode || !letterDept || !yearParam || !serialParam) {
      return NextResponse.json(
        { error: "letterCode, letterDept, year, serialNumber wajib diisi" },
        { status: 400 },
      );
    }

    const year = Number(yearParam);
    const serialNumber = Number(serialParam);

    if (!Number.isInteger(year) || !Number.isInteger(serialNumber)) {
      return NextResponse.json(
        { error: "year dan serialNumber harus angka" },
        { status: 400 },
      );
    }

    const rows = await executeQuery(
      `
      SELECT id
      FROM generated_letters
      WHERE year = ?
        AND letter_code = ?
        AND letter_dept = ?
        AND serial_number = ?
      LIMIT 1
      `,
      [year, letterCode, letterDept, serialNumber],
    );

    const available = !rows || rows.length === 0;

    return NextResponse.json({
      success: true,
      available,
    });
  } catch (error) {
    console.error("Check letter number error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengecek nomor surat" },
      { status: 500 },
    );
  }
}
