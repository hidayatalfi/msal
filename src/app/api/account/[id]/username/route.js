import { getUserPermissions, getUserRoles } from "@/lib/auth/auth-service";
import { buildAuthCookie, signAuthToken } from "@/lib/auth/jwt-service";
import { executeQuery } from "@/lib/db";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { new_username } = await request.json();

    if (!new_username) {
      return Response.json(
        { message: "new_username wajib diisi" },
        { status: 400 },
      );
    }

    // Cek username belum dipakai user lain
    const existing = await executeQuery(
      "SELECT id FROM users WHERE username = ? AND unique_id_user <> ? LIMIT 1",
      [new_username, id],
    );
    if (existing.length > 0) {
      return Response.json(
        { message: "Username sudah digunakan user lain" },
        { status: 409 },
      );
    }

    // Update ke DB
    await executeQuery(
      "UPDATE users SET username = ? WHERE unique_id_user = ?",
      [new_username, id],
    );

    // Ambil data user terbaru untuk isi token
    const rows = await executeQuery(
      "SELECT id, username, full_name, unique_id_user FROM users WHERE unique_id_user = ? LIMIT 1",
      [id],
    );
    if (!rows.length) {
      return Response.json(
        { message: "User tidak ditemukan setelah update" },
        { status: 404 },
      );
    }
    const user = rows[0];

    // Kalau perlu roles & permissions lagi
    // (pakai fungsi yang sama dengan login)
    const roles = await getUserRoles(user.id);
    const permissions = await getUserPermissions(user.id);

    // const roles = []; // atau isi sesuai kebutuhanmu
    // const permissions = [];

    const newAccessToken = signAuthToken({
      sub: user.id,
      username: user.username,
      fullName: user.full_name,
      uniqueId: user.unique_id_user,
      roles,
      permissions,
    });

    const res = Response.json(
      { message: "Username berhasil diupdate" },
      { status: 200 },
    );

    // set cookie auth_token baru
    res.headers.append("Set-Cookie", buildAuthCookie(newAccessToken));

    return res;
  } catch (err) {
    console.error("Update username error:", err);
    return Response.json({ message: "Gagal update username" }, { status: 500 });
  }
}
