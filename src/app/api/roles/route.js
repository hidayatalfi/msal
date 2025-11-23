// src/app/api/users/route.js
import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { getServerAuth } from "@/lib/auth/server-auth";
import { hasRole } from "@/lib/auth/rbac-service";

export async function GET() {
  // 1. Cek sudah login atau belum
  const { authenticated, user } = await getServerAuth();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Hanya ADMIN yang boleh akses
  if (!hasRole(user, "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 3. Query data users
  try {
    const rows = await executeQuery(
      `SELECT id, name FROM roles ORDER BY name ASC`,
    );

    return NextResponse.json({ roles: rows }, { status: 200 });
  } catch (err) {
    console.error("GET /api/roles error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
