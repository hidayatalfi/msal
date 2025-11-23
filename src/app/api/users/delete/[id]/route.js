import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerAuth } from "@/lib/auth/server-auth";
import { hasRole } from "@/lib/auth/rbac-service";

export async function DELETE(_req, { params }) {
  try {
    // 1. Cek sudah login atau belum
    const { authenticated, user } = await getServerAuth();

    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Hanya ADMIN yang boleh akses
    if (!hasRole(user, "admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const getParams = await params;
    const id = getParams.id;
    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    // 3) Hapus row di DB
    await executeQuery("DELETE FROM users WHERE unique_id_user = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete user error:", err);
    return new NextResponse("Delete error", { status: 500 });
  }
}
