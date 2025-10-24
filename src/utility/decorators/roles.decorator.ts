import { SetMetadata } from '@nestjs/common';
import { Role } from '../common/enums/roles.enum';

// Key used by the Reflector to read metadata
export const ROLES_KEY = 'roles';

/**
 * Method or class decorator that defines which roles are allowed.
 * Example: @Roles(Roles.ADMIN, Roles.USER)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
