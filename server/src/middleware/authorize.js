import { ForbiddenError } from '../utils/apiError.js';

/**
 * Role-based access control (RBAC) middleware factory.
 * Usage: authorize('OWNER', 'MANAGER')
 * Must be used AFTER authenticate middleware (requires req.user).
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required before authorization');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role '${req.user.role}' does not have permission for this action`
      );
    }

    next();
  };
}
