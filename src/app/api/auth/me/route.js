// src/app/api/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth/jwt-service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: payload.sub,
          username: payload.username,
          fullName: payload.fullName,
          uniqueIdUser: payload.uniqueId,
          roles: payload.roles || [],
          permissions: payload.permissions || [],
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
