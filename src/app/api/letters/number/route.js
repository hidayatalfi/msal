// app/api/letters/next-number/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { formatSerialNumber, monthToRoman } from "@/lib/letterNumber";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // letterCode = B: MUT, PROM, dll
    const letterCode = searchParams.get("letterCode");
    // letterDept = C: MSALGROUP-HROPS, dll
    const letterDept = searchParams.get("letterDept");
    // optional: year tertentu (kalau tidak diisi, pakai tahun dari tanggal)
    const yearParam = searchParams.get("year");
    // optional: tanggal surat (yyyy-mm-dd), kalau tidak diisi pakai hari ini
    const dateParam = searchParams.get("date");

    if (!letterCode || !letterDept) {
      return NextResponse.json(
        { error: "letterCode dan letterDept wajib diisi" },
        { status: 400 },
      );
    }

    // Tentukan tanggal, tahun, bulan
    const date = dateParam ? new Date(dateParam) : new Date();
    const year = yearParam ? Number(yearParam) : date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const monthRoman = monthToRoman(month);

    // 1) Cari serial_number terakhir untuk kombinasi (year + letter_code + letter_dept)
    const rows = await executeQuery(
      `
      SELECT MAX(serial_number) AS last_serial
      FROM generated_letters
      WHERE year = ? AND letter_code = ? AND letter_dept = ?
      `,
      [year, letterCode, letterDept],
    );

    const lastSerial =
      rows && rows[0] && rows[0].last_serial ? Number(rows[0].last_serial) : 0;

    const nextSerial = lastSerial + 1; // A (angka)
    const A = formatSerialNumber(nextSerial); // A (string 3 digit / 4 digit)

    // 2) Susun nomor surat preview: A/B/C/D/E
    const letterNumberPreview = `${A}/${letterCode}/${letterDept}/${monthRoman}/${year}`;

    return NextResponse.json({
      success: true,
      data: {
        year,
        month,
        monthRoman,
        letterCode,
        letterDept,
        serialNumber: nextSerial, // A dalam bentuk angka
        serialDisplay: A, // A dalam bentuk string (001.., 1000..)
        letterNumber: letterNumberPreview, // A/B/C/D/E
      },
    });
  } catch (error) {
    console.error("Next letter number error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil nomor surat berikutnya" },
      { status: 500 },
    );
  }
}
