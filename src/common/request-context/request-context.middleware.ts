import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to initialize request context for each request
 * Stores request ID, user info, IP address, and other request metadata
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Generate unique request ID
      const requestId = (req.headers['x-request-id'] as string) || uuidv4();

      // Extract user info from JWT payload (set by auth guard)
      const user = (req as any).user;
      const userId = user?.id || user?.sub;
      const requestUser = user
        ? {
            id: user.id || user.sub,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        : undefined;

      // Extract IP address (handle proxy scenarios)
      const ip =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        (req.headers['x-real-ip'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        'unknown';

      // Initialize request context
      RequestContextService.start(requestId, {
        requestId,
        userId,
        user: requestUser,
        ip,
        userAgent: req.headers['user-agent'] as string,
      });

      // Set request ID header for tracing
      res.setHeader('x-request-id', requestId);

      // Clear context after response is sent
      res.on('finish', () => {
        RequestContextService.clear(requestId);
      });

      next();
    } catch (error) {
      console.error('RequestContextMiddleware error:', error);
      next();
    }
  }
}

/**
 * Export as a function for use in module configuration
 */
export function requestContextMiddleware() {
  return (req: Request, res: Response, next: NextFunction): void => {
    const middleware = new RequestContextMiddleware();
    middleware.use(req, res, next);
  };
}