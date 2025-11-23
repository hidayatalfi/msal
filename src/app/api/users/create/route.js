import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { executeQuery, executeTransaction } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, username, password, role_id } = body;

    if (!name || !username || !password || !role_id) {
      return Response.json(
        { message: "full_name, username, password, role_id wajib diisi" },
        { status: 400 },
      );
    }

    // cek username unik (pakai helper biasa, tidak perlu transaksi)
    const existing = await executeQuery(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username],
    );

    if (existing.length > 0) {
      return Response.json(
        { message: "Username sudah digunakan" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueId = nanoid(16);

    // pakai helper transaksi supaya users + user_roles konsisten
    const result = await executeTransaction(async (conn) => {
      const [userResult] = await conn.execute(
        `INSERT INTO users (username, password, full_name, is_active, unique_id_user, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [username, hashedPassword, name, 1, uniqueId],
      );

      const userId = userResult.insertId;

      await conn.execute(
        `INSERT INTO user_roles (user_id, role_id, assigned_at)
         VALUES (?, ?, NOW())`,
        [userId, role_id],
      );

      return { userId };
    });

    return Response.json(
      {
        message: "User berhasil dibuat",
        data: {
          id: result.userId,
          username,
          name,
          unique_id: uniqueId,
          role_id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create user error:", error);
    return Response.json({ message: "Gagal membuat user" }, { status: 500 });
  }
}
