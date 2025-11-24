import { executeTransaction } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { old_password, new_password } = body;

    if (!old_password || !new_password) {
      return Response.json(
        { message: "old_password dan new_password wajib diisi" },
        { status: 400 },
      );
    }

    const result = await executeTransaction(async (conn) => {
      // Ambil hash password lama
      const [rows] = await conn.execute(
        "SELECT password FROM users WHERE unique_id_user = ? LIMIT 1",
        [id],
      );
      if (!Array.isArray(rows) || rows.length === 0) {
        return { status: 404, message: "User tidak ditemukan" };
      }

      const user = rows[0];

      const match = await bcrypt.compare(old_password, user.password);
      if (!match) {
        return { status: 401, message: "Password lama salah" };
      }

      const newHash = await bcrypt.hash(new_password, 10);

      await conn.execute(
        "UPDATE users SET password = ? WHERE unique_id_user = ?",
        [newHash, id],
      );

      return { status: 200, message: "Password berhasil diganti" };
    });

    return Response.json(
      { message: result.message },
      { status: result.status },
    );
  } catch (err) {
    console.error("Change password error:", err);
    return Response.json(
      { message: "Gagal mengganti password" },
      { status: 500 },
    );
  }
}
