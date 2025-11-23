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
      `
      SELECT
        u.id,
        u.username,
        u.full_name,
        u.is_active,
        u.unique_id_user,
        u.created_at,
        u.updated_at,
        r.name AS role_name
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      ORDER BY u.created_at ASC
      `,
    );

    // mapping: gabungkan role_name per user.id
    const usersMap = new Map();

    for (const row of rows) {
      if (!usersMap.has(row.id)) {
        usersMap.set(row.id, {
          id: row.id,
          username: row.username,
          fullName: row.full_name,
          isActive: !!row.is_active,
          uniqueIdUser: row.unique_id_user,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          roles: [],
        });
      }
      if (row.role_name) {
        usersMap.get(row.id).roles.push(row.role_name);
      }
    }

    const users = Array.from(usersMap.values());

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("GET /api/users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
