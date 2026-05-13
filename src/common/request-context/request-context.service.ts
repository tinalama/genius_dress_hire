import { Injectable, Scope } from '@nestjs/common';
import { RequestContext, RequestUserContext } from './request-context.model';

/**
 * Async local storage for request context
 * Used to store request-scoped data that's accessible throughout the request lifecycle
 */
@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private static requestContext: Map<string, RequestContext> = new Map();

  /**
   * Start a new request context
   * @param requestId Unique request identifier
   * @param context Initial context data
   */
  static start(requestId: string, context: Partial<RequestContext> = {}): void {
    const fullContext: RequestContext = {
      requestId,
      timestamp: new Date(),
      ...context,
    };
    this.requestContext.set(requestId, fullContext);
  }

  /**
   * Get current request context
   */
  static get(): RequestContext {
    const contexts = Array.from(this.requestContext.values());
    return contexts[contexts.length - 1];
  }

  /**
   * Get user from current request context
   */
  static getUser(): RequestUserContext | undefined {
    const context = this.get();
    return context.user;
  }

  /**
   * Get user ID from current request context
   */
  static getUserId(): string | undefined {
    const context = this.get();
    return context.userId || context.user?.id;
  }

  /**
   * Update request context
   * @param context Context updates
   */
  static update(context: Partial<RequestContext>): void {
    const current = this.get();
    if (current && current.requestId) {
      this.requestContext.set(current.requestId, { ...current, ...context });
    }
  }

  /**
   * Clear request context
   * @param requestId Request ID to clear
   */
  static clear(requestId: string): void {
    this.requestContext.delete(requestId);
  }
}