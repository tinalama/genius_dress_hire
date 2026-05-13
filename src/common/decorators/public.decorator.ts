import { SetMetadata } from '@nestjs/common';

/**
 * Decorator to mark routes as public (no authentication required)
 * Usage: @Public()
 */
export const PUBLIC_ROUTE_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_ROUTE_KEY, true);