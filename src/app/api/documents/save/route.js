// app/api/documents/create/route.js
import { executeQuery } from "@/lib/db";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      storedKey,
      originalName,
      size,
      mime,
      docNumber,
      type,
      company,
      dateStaff,
      dateManager,
      dateDirector,
      dateFinance,
      datePurchasing,
      nominalDiajukan,
      nominalDisetujui,
      note,
    } = body || {};

    if (!storedKey || !originalName) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existing = await executeQuery(
      "SELECT unique_id_doc FROM documents WHERE doc_number = ? LIMIT 1",
      [docNumber],
    );

    if (existing && existing.length > 0) {
      return new NextResponse("Nomor dukmen sudah ada", { status: 409 });
    }

    const results = await executeQuery(
      `INSERT INTO documents (original_name, stored_key, size_bytes, mime_type, doc_type, doc_number, company, staff_date, manager_date, director_date, purchasing_date, finance_date, submitted, approved, note, unique_id_doc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        originalName,
        storedKey,
        size,
        mime,
        type,
        docNumber,
        company,
        dateStaff || null,
        dateManager || null,
        dateDirector || null,
        datePurchasing || null,
        dateFinance || null,
        nominalDiajukan,
        nominalDisetujui,
        note,
        nanoid(),
      ],
    );

    return NextResponse.json(
      { message: "Berhasil menyimpan ke database" },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return new NextResponse("Insert error", { status: 500 });
  }
}
