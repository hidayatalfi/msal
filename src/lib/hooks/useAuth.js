"use client";

import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { RBACService } from "@/lib/auth/rbac-service";

export function useAuth() {
  const { user, isLoading, login, logout, refreshUser, isAuthenticated } =
    useAuthContext();
  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    // Role checks
    hasRole: (role) => RBACService.hasRole(user?.roles, role),
    hasAnyRole: (roles) => RBACService.hasAnyRole(user?.roles, roles),
    hasAllRoles: (roles) => RBACService.hasAllRoles(user?.roles, roles),
    // Permission checks
    hasPermission: (permission) =>
      RBACService.hasPermission(user?.permissions, permission),
    hasAnyPermission: (permissions) =>
      RBACService.hasAnyPermission(user?.permissions, permissions),
    hasAllPermissions: (permissions) =>
      RBACService.hasAllPermissions(user?.permissions, permissions),
    canPerformAction: (resource, action) =>
      RBACService.canPerformAction(user?.permissions, resource, action),
  };
}
