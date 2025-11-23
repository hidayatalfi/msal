import bcrypt from "bcryptjs";
import { executeQuery } from "../db";
import crypto from "crypto";

// --- USERS & ROLES ---

export async function findUserByUsername(username) {
  const rows = await executeQuery(
    `
    SELECT id, username, password, full_name, is_active, unique_id_user
    FROM users
    WHERE username = ?
    LIMIT 1
    `,
    [username],
  );
  return rows[0] || null;
}

export async function getUserRoles(userId) {
  const rows = await executeQuery(
    `
    SELECT r.name
    FROM roles r
    JOIN user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = ?
    `,
    [userId],
  );
  // kembalikan array nama role, mis: ["ADMIN","HR"]
  return rows.map((r) => r.name);
}

// --- PERMISSIONS (berdasarkan role) ---

export async function getUserPermissions(userId) {
  const rows = await executeQuery(
    `
    SELECT DISTINCT p.name
    FROM permissions p
    JOIN role_permissions rp ON rp.permission_id = p.id
    JOIN user_roles ur ON ur.role_id = rp.role_id
    WHERE ur.user_id = ?
    `,
    [userId],
  );
  return rows.map((r) => r.name);
}

// --- PASSWORD & LOGIN_ATTEMPTS ---

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function logLoginAttempt({
  identifier,
  success,
  ipAddress,
  userAgent,
}) {
  try {
    await executeQuery(
      `
      INSERT INTO login_attempts
        (identifier, ip_address, attempted_at, success)
      VALUES
        (?, ?, NOW(), ?)
      `,
      [identifier, ipAddress || null, success ? 1 : 0],
    );
  } catch (e) {
    console.error("logLoginAttempt error:", e);
  }
}

export function generateRefreshTokenValue() {
  return crypto.randomBytes(32).toString("hex"); // string random
}

export async function saveRefreshToken(userId, token, expiresAt) {
  await executeQuery(
    `
    INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
    VALUES (?, ?, ?, NOW())
    `,
    [userId, token, expiresAt],
  );
}
