import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JWTService } from "./jwt-service";
import { UserService } from "./user-service";

// ========================================
// CORE GUARDS
// ========================================

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const payload = JWTService.verifyAccessToken(accessToken);

  if (!payload) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      redirect("/login");
    }

    const refreshPayload = JWTService.verifyRefreshToken(refreshToken);

    if (!refreshPayload) {
      redirect("/login");
    }

    const userWithRoles = await UserService.getUserWithRoles(
      refreshPayload.userId,
    );

    if (!userWithRoles) {
      redirect("/login");
    }

    return {
      id: userWithRoles.id,
      username: userWithRoles.username,
      name: userWithRoles.full_name,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    };
  }

  return {
    id: payload.userId,
    username: payload.username,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}

// ========================================
// HELPER: With Explicit Redirect Path
// ========================================

export async function requireAuthWithRedirect(redirectPath) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    const loginUrl = `/login?redirect=${encodeURIComponent(redirectPath)}`;
    redirect(loginUrl);
  }

  const payload = JWTService.verifyAccessToken(accessToken);

  if (!payload) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }

    const refreshPayload = JWTService.verifyRefreshToken(refreshToken);

    if (!refreshPayload) {
      redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }

    const userWithRoles = await UserService.getUserWithRoles(
      refreshPayload.userId,
    );

    if (!userWithRoles) {
      redirect(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }

    return {
      id: userWithRoles.id,
      username: userWithRoles.username,
      name: userWithRoles.full_name,
      roles: userWithRoles.roles,
      permissions: userWithRoles.permissions,
    };
  }

  return {
    id: payload.userId,
    username: payload.username,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  const payload = JWTService.verifyAccessToken(accessToken);

  if (!payload) {
    return null;
  }

  return {
    id: payload.userId,
    username: payload.username,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}

// ========================================
// ROLE-BASED GUARDS
// ========================================

export async function requireRole(roles, options = {}) {
  const { operator = "OR", message, suggestedAction } = options;

  const user = await requireAuth();

  let hasAccess = false;

  if (operator === "OR") {
    hasAccess = roles.some((role) => user.roles.includes(role));
  } else if (operator === "AND") {
    hasAccess = roles.every((role) => user.roles.includes(role));
  }

  if (!hasAccess) {
    const params = new URLSearchParams({
      type: "role",
      required: roles.join(","),
      current: user.roles.join(","),
      operator,
    });

    if (message) params.append("message", message);
    if (suggestedAction) params.append("suggestedAction", suggestedAction);

    redirect(`/unauthorized?${params.toString()}`);
  }

  return user;
}

// ========================================
// PERMISSION-BASED GUARDS
// ========================================

export async function requirePermission(permissions, options = {}) {
  const { operator = "OR", message, suggestedAction } = options;

  const user = await requireAuth();

  let hasAccess = false;

  if (operator === "OR") {
    hasAccess = permissions.some((perm) => user.permissions.includes(perm));
  } else if (operator === "AND") {
    hasAccess = permissions.every((perm) => user.permissions.includes(perm));
  }

  if (!hasAccess) {
    const params = new URLSearchParams({
      type: "permission",
      required: permissions.join(","),
      current: user.permissions?.join(",") || "",
      operator,
    });

    if (message) params.append("message", message);
    if (suggestedAction) params.append("suggestedAction", suggestedAction);

    redirect(`/unauthorized?${params.toString()}`);
  }

  return user;
}

// ========================================
// COMBINED GUARDS
// ========================================

export async function requireRoleAndPermission(
  roles,
  permissions,
  options = {},
) {
  const {
    roleOperator = "OR",
    permissionOperator = "OR",
    message,
    suggestedAction,
  } = options;

  const user = await requireAuth();

  let hasRole = false;
  if (roleOperator === "OR") {
    hasRole = roles.some((role) => user.roles.includes(role));
  } else {
    hasRole = roles.every((role) => user.roles.includes(role));
  }

  let hasPermission = false;
  if (permissionOperator === "OR") {
    hasPermission = permissions.some((perm) => user.permissions.includes(perm));
  } else {
    hasPermission = permissions.every((perm) =>
      user.permissions.includes(perm),
    );
  }

  if (!hasRole || !hasPermission) {
    const params = new URLSearchParams({
      type: "combined",
      requiredRoles: roles.join(","),
      requiredPermissions: permissions.join(","),
      currentRoles: user.roles.join(","),
      currentPermissions: user.permissions?.join(",") || "",
      roleOperator,
      permissionOperator,
    });

    if (message) params.append("message", message);
    if (suggestedAction) params.append("suggestedAction", suggestedAction);

    redirect(`/unauthorized?${params.toString()}`);
  }

  return user;
}
