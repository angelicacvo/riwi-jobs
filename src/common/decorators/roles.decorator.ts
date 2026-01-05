import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/roles.enum';

/**
 * Metadata key for roles in custom decorator
 */
export const ROLES_KEY = 'roles';

/**
 * Custom decorator to specify required roles for routes
 * Usage: @Roles(UserRole.ADMIN, UserRole.MANAGER)
 * @param roles - List of roles allowed to access the route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
