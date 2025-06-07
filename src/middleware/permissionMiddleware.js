import { prisma } from '../config/prismaClient.js';

/**
 * Middleware to check if a user has the required permissions
 * @param {string|string[]} role - Permission(s) required to access the endpoint
 */
export function checkPermission(role) {
  return async (req, res, next) => {
    try {
      // If no user attached to request, they're not authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Check if user has all required permissions
      const rolesArray = Array.isArray(role) ? role : [role];

      const hasPermission = rolesArray.includes(req.user.role.toLowerCase());
      if (!hasPermission) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      return next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
