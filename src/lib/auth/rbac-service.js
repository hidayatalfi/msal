// src/lib/auth/rbac-service.js

export function hasRole(user, roleName) {
  if (!user || !Array.isArray(user.roles)) return false;
  return user.roles.includes(roleName);
}

export function hasAnyRole(user, roleNames) {
  if (!user || !Array.isArray(user.roles)) return false;
  return roleNames.some((r) => user.roles.includes(r));
}

export function hasPermission(user, permName) {
  if (!user || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(permName);
}

export function hasAnyPermission(user, permNames) {
  if (!user || !Array.isArray(user.permissions)) return false;
  return permNames.some((p) => user.permissions.includes(p));
}
