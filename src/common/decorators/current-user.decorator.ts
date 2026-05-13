import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUserContext } from '../request-context/request-context.model';

/**
 * Decorator to extract the current authenticated user from the request
 * Usage: @CurrentUser() user: RequestUserContext
 * or with property: @CurrentUser('email') email: string
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUserContext | undefined, ctx: ExecutionContext): RequestUserContext | any => {
    const request = ctx.switchToHttp().getRequest();

    // First try to get from request context
    const user = request.user;

    if (!user) {
      return null;
    }

    // Return specific property if requested, otherwise return entire user object
    return data ? user[data] : user;
  }
);