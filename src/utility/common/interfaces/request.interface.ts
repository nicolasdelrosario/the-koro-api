import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

/**
 * Extends the Express Request with `user` as JwtPayload.
 * Populated by LocalAuthGuard and JwtAuthGuard.
 */
export interface IRequest extends Request {
  user: JwtPayload;
}
