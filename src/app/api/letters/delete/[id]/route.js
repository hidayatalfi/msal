import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function DELETE(_req, { params }) {
  try {
    const getParams = await params;
    const id = getParams.id;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    // 3) Hapus row di DB
    await executeQuery(
      "DELETE FROM generated_letters WHERE unique_id_generated_letter = ?",
      [id],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete letter error:", err);
    return new NextResponse("Delete error", { status: 500 });
  }
}
