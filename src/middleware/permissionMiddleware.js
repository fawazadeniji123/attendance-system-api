import { prisma } from '../config/prismaClient';

/**
 * Middleware to check if a user has the required permissions
 * @param {string|string[]} requiredPermissions - Permission(s) required to access the endpoint
 */
export function checkPermission(requiredPermissions) {
  return async (req, res, next) => {
    try {
      // If no user attached to request, they're not authenticated
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Get user with role and permissions
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Extract permission names from user's role
      const userPermissions = user.role.permissions.map((p) => p.name);

      // Check if user has all required permissions
      const permissionsArray = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const hasPermission = permissionsArray.every((permission) =>
        userPermissions.includes(permission)
      );

      // Allow access if user has permission
      if (hasPermission) {
        return next();
      }

      // Special case: check if user is trying to access their own profile
      if (req.params.id && req.params.id === req.user.id) {
        // For profile-specific permissions
        if (
          permissionsArray.includes('view:profile') ||
          permissionsArray.includes('update:profile')
        ) {
          return next();
        }
      }

      return res.status(403).json({ error: 'Insufficient permissions' });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
