import { Role } from 'src/utility/common/enums/roles.enum';

/**
 * Represents the data included within the JWT token.
 * This payload is signed in the AuthService and validated in the JwtStrategy.
 */
export interface JwtPayload {
  sub: string; // User ID (standard JWT subject)
  email: string; // User email
  name: string; // User name (optional but useful)
  roles: Role[]; // Current user role
  iat?: number; // Issued at timestamp (automatically added by JWT)
  exp?: number; // Expiration timestamp (automatically added)
}
