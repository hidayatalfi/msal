import { NextResponse } from "next/server";
import { AuthService } from "@/lib/auth/auth-service";

export async function POST() {
  try {
    await AuthService.logout();

    return NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat logout" },
      { status: 500 },
    );
  }
}
