import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { executeQuery } from "@/lib/db";
import { signAuthToken, buildAuthCookie } from "@/lib/auth/jwt-service";
import { getUserRoles, getUserPermissions } from "@/lib/auth/auth-service";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const rows = await executeQuery(
      `
      SELECT rt.user_id, rt.expires_at, u.username, u.full_name, u.unique_id_user, u.is_active
      FROM refresh_tokens rt
      JOIN users u ON u.id = rt.user_id
      WHERE rt.token = ?
      LIMIT 1
      `,
      [refreshToken],
    );

    const row = rows[0];
    if (
      !row ||
      !row.is_active ||
      new Date(row.expires_at).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const roles = await getUserRoles(row.user_id);
    const permissions = await getUserPermissions(row.user_id);

    const accessToken = signAuthToken({
      sub: row.user_id,
      username: row.username,
      fullName: row.full_name,
      uniqueId: row.unique_id_user,
      roles,
      permissions,
    });

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.set("Set-Cookie", buildAuthCookie(accessToken));
    return res;
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json({ error: "Refresh error" }, { status: 500 });
  }
}
