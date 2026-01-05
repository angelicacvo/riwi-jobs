import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Protects routes by validating JWT token in Authorization header
 * Uses Passport JWT strategy for token validation
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
