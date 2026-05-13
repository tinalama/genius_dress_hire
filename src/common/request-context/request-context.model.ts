/**
 * Base request context interface
 * Stores request-scoped data available throughout the request lifecycle
 */
export interface RequestContext {
  requestId?: string;
  userId?: string;
  user?: RequestUserContext;
  timestamp?: Date;
  ip?: string;
  userAgent?: string;
}

/**
 * User context stored in request
 * Contains information about the authenticated user making the request
 */
export interface RequestUserContext {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}