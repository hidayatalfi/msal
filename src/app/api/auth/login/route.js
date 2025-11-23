// src/app/api/login/route.js
import { NextResponse } from "next/server";

import {
  findUserByUsername,
  getUserRoles,
  getUserPermissions,
  verifyPassword,
  logLoginAttempt,
  saveRefreshToken,
  generateRefreshTokenValue,
} from "@/lib/auth/auth-service";
import { signAuthToken, buildAuthCookie } from "@/lib/auth/jwt-service";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      null;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const user = await findUserByUsername(username);

    if (!user || !user.is_active) {
      await logLoginAttempt({
        identifier: username,
        success: false,
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      await logLoginAttempt({
        identifier: username,
        success: false,
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    const roles = await getUserRoles(user.id);
    const permissions = await getUserPermissions(user.id);

    // Access token (JWT)
    const accessToken = signAuthToken({
      sub: user.id,
      username: user.username,
      fullName: user.full_name,
      uniqueId: user.unique_id_user,
      roles,
      permissions,
    });

    // Refresh token 7 hari
    const refreshTokenValue = generateRefreshTokenValue();
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await saveRefreshToken(user.id, refreshTokenValue, refreshExpires);

    await logLoginAttempt({
      identifier: username,
      success: true,
      ipAddress: ip,
    });

    const res = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          uniqueIdUser: user.unique_id_user,
          roles,
          permissions,
        },
      },
      { status: 200 },
    );

    const isProd = process.env.NODE_ENV === "production";

    // cookie refresh_token
    const refreshCookie = [
      `refresh_token=${refreshTokenValue}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${7 * 24 * 60 * 60}`,
      isProd ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");

    // set kedua cookie
    res.headers.append("Set-Cookie", buildAuthCookie(accessToken));
    res.headers.append("Set-Cookie", refreshCookie);

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login error" }, { status: 500 });
  }
}
