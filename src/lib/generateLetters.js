"use server";
import { nanoid } from "nanoid";
import { executeTransaction } from "./db";

export async function generateLetterAction(dataSurat) {
  if (!Array.isArray(dataSurat) || dataSurat.length < 1) {
    return { ok: false, error: "datasurat harus array minimal 1" };
  }
  const query = `INSERT INTO generated_letters (letter_name, letter_number, letter_type, company_name, company_code, year, letter_code, letter_dept, serial_number, letter_date, effective_date, city, signature_name, signature_position, employee, unique_id_generated_letter) VALUES ?`;
  const values = dataSurat.map((item) => [
    "Surat Keputusan",
    item.letterNumber,
    item.type,
    item.companyName,
    item.companyID,
    item.year,
    item.letterCode,
    item.letterDept,
    item.serial,
    item.letterDate,
    item.effectiveDate,
    item.city,
    item.manager,
    item.position,
    JSON.stringify(item.employee),
    nanoid(),
  ]);
  try {
    await executeTransaction(async (conn) => {
      await conn.query(query, [values]);
    });
    const q = new URLSearchParams({
      data: encodeURIComponent(JSON.stringify(dataSurat)),
    }).toString();
    const url =
      dataSurat.length === 1
        ? `/api/letters/generate?${q}`
        : `/api/letters/generate/batch?${q}`;
    // Return URL (jangan redirect di server action karena kita trigger dari onClick)
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: "Gagal menyimpan nomor surat" };
  }
}
