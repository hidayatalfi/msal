export const RBACService = {
  // Check if user has specific role
  hasRole(userRoles, requiredRole) {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    return userRoles.includes(requiredRole);
  },

  // Check if user has any of the roles
  hasAnyRole(userRoles, requiredRoles) {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    if (!requiredRoles || !Array.isArray(requiredRoles)) return false;
    return requiredRoles.some((role) => userRoles.includes(role));
  },

  // Check if user has all roles
  hasAllRoles(userRoles, requiredRoles) {
    if (!userRoles || !Array.isArray(userRoles)) return false;
    if (!requiredRoles || !Array.isArray(requiredRoles)) return false;
    return requiredRoles.every((role) => userRoles.includes(role));
  },

  // Check if user has specific permission
  hasPermission(userPermissions, requiredPermission) {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    return userPermissions.includes(requiredPermission);
  },

  // Check if user has any of the permissions
  hasAnyPermission(userPermissions, requiredPermissions) {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    if (!requiredPermissions || !Array.isArray(requiredPermissions))
      return false;
    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  },

  // Check if user has all permissions
  hasAllPermissions(userPermissions, requiredPermissions) {
    if (!userPermissions || !Array.isArray(userPermissions)) return false;
    if (!requiredPermissions || !Array.isArray(requiredPermissions))
      return false;
    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  },

  // Check if user can perform action on resource
  canPerformAction(userPermissions, resource, action) {
    const permissionName = `${resource}.${action}`;
    return this.hasPermission(userPermissions, permissionName);
  },

  // Get user's permissions for specific resource
  getResourcePermissions(userPermissions, resource) {
    if (!userPermissions || !Array.isArray(userPermissions)) return [];
    return userPermissions
      .filter((perm) => perm.startsWith(`${resource}.`))
      .map((perm) => perm.split(".")[1]);
  },
};
