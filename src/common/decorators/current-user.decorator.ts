import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

/**
 * Custom parameter decorator to extract current authenticated user from request
 * Usage: async method(@CurrentUser() user: User)
 * User is attached to request by JWT authentication guard
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
