import { executeQuery } from "@/lib/db";
import bcrypt from "bcryptjs";

export const UserService = {
  // Find user by username or email
  async findByCredentials(identifier) {
    const query = `
      SELECT id, username, password, full_name, is_active
      FROM users
      WHERE username = ? AND is_active = TRUE
      LIMIT 1
    `;
    const results = await executeQuery(query, [identifier]);

    // Debug log
    console.log("🔍 Finding user:", identifier);
    console.log("Found:", results.length > 0 ? "Yes" : "No");

    return results[0] || null;
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    console.log("🔑 Verifying password...");
    console.log("Plain password length:", plainPassword.length);
    console.log("Hash starts with:", hashedPassword.substring(0, 7));

    const isValid = await bcrypt.compare(plainPassword, hashedPassword);

    console.log("Password valid:", isValid ? "✅ Yes" : "❌ No");

    return isValid;
  },

  // Get user with all roles and permissions
  async getUserWithRoles(userId) {
    const userQuery = `
      SELECT unique_id_user, id, username, full_name, is_active
      FROM users
      WHERE id = ? AND is_active = TRUE
    `;
    const users = await executeQuery(userQuery, [userId]);
    const user = users[0];

    if (!user) return null;

    // Get all roles for user
    const rolesQuery = `
      SELECT r.id, r.name, r.description
      FROM roles r
      INNER JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `;
    const roles = await executeQuery(rolesQuery, [userId]);

    // Get all permissions from all roles
    const permissionsQuery = `
      SELECT DISTINCT p.id, p.name, p.description, p.resource, p.action
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = ?
    `;
    const permissions = await executeQuery(permissionsQuery, [userId]);

    return {
      ...user,
      roles: roles.map((r) => r.name),
      roleDetails: roles,
      permissions: permissions.map((p) => p.name),
      permissionDetails: permissions,
    };
  },

  // Hash password (untuk create user)
  async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    return await bcrypt.hash(password, saltRounds);
  },
};
