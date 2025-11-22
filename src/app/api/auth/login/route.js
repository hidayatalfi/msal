import { NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/auth-service";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Get IP address
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const result = await AuthService.login({ username, password }, ipAddress);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat login" },
      { status: 500 },
    );
  }
}
