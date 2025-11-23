// src/app/api/logout/route.js
import { clearAuthCookie } from "@/lib/auth/jwt-service";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.headers.set("Set-Cookie", clearAuthCookie());
  return res;
}
